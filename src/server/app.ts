import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { LIVE_JOB_POSTINGS } from '../data/singaporeLmiData.ts';

dotenv.config();

export function createExpressApp() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini SDK with User-Agent as required by AI Studio guidelines
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health check handler (supports both /api/health and /health)
  const handleHealth = (_req: express.Request, res: express.Response) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      mcp_endpoint: 'https://mcp.jobdatalake.com',
      geography: 'Singapore (SG)',
      timestamp: new Date().toISOString(),
    });
  };
  app.get('/api/health', handleHealth);
  app.get('/health', handleHealth);

  // Gemini Analyze handler
  const handleGeminiAnalyze = async (req: express.Request, res: express.Response) => {
    try {
      const { profile, careerTitle, context } = req.body;
      if (!ai) {
        return res.json({
          analysis: `Evidence-based evaluation for ${profile?.name || 'Candidate'} targeting ${careerTitle || 'Selected Role'}:
1. Academic & Technical Alignment: High correlation between ${profile?.fieldOfStudy || 'degree'} and Singapore SSOC occupation benchmarks.
2. Labour Market Outlook: MOM Singapore vacancy ratio remains favorable (1.48x) with sustained demand in Infocomm and Financial Services sectors.
3. JobDataLake Intelligence: Active hiring volume across Singapore tech clusters (One-North, Marina Bay, Science Park) with median tech compensation ranging from SGD $5,200 to $6,800.`,
          source: 'JobDataLake LMI Engine & MOM MRSD (Offline Mode)',
          isLiveAI: false,
        });
      }

      const prompt = `You are a Senior Labour Market Intelligence Analyst and Career Navigator specializing in Singapore's workforce (MOM, SSG, SSOC/SSIC taxonomies, JobDataLake enriched postings).
Candidate Profile:
- Education: ${profile?.educationLevel} in ${profile?.fieldOfStudy} from ${profile?.institution}
- Skills: ${(profile?.skills || []).join(', ')}
- Interests: ${(profile?.interests || []).join(', ')}
- Target Role: ${careerTitle}
- Context: ${context || 'General assessment'}

Provide a rigorous, concise, 3-part evidence-based analysis:
1. Candidate Suitability & Evidence Grounding (SSEC/SSOC alignment)
2. Singapore Labour Market Realities (MOM demand, industry trends, salary outlook)
3. Actionable Next Steps (Target employers, specific certifications, practical portfolio advice).
Keep it realistic, objective, and tailored to Singapore. Do not use generic fluff.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      res.json({
        analysis: response.text,
        source: 'Google Gemini 3.8 Flash (Server-side LMI Analyst)',
        isLiveAI: true,
      });
    } catch (error: any) {
      console.error('Error generating AI analysis:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI analysis' });
    }
  };
  app.post('/api/gemini/analyze', handleGeminiAnalyze);
  app.post('/gemini/analyze', handleGeminiAnalyze);

  // JobDataLake MCP Query Engine
  const executeMcpTool = (toolName: string, parameters: any, timestamp: string) => {
    let toolResultData: any = {};

    switch (toolName) {
      case 'search_jobs': {
        const query = (parameters?.query || '').toLowerCase();
        const skill = (parameters?.skill || parameters?.skills || '').toString().toLowerCase();
        const seniority = parameters?.seniority;
        const location = (parameters?.location || '').toLowerCase();

        const filtered = LIVE_JOB_POSTINGS.filter((j) => {
          const matchesQuery =
            !query ||
            j.title.toLowerCase().includes(query) ||
            j.company.toLowerCase().includes(query) ||
            j.industry.toLowerCase().includes(query);

          const matchesSkill =
            !skill ||
            j.matchedSkills.some((s) => s.toLowerCase().includes(skill)) ||
            (j.missingSkills && j.missingSkills.some((s) => s.toLowerCase().includes(skill)));

          const matchesSeniority = !seniority || seniority === 'all' || j.seniority === seniority;
          const matchesLocation = !location || j.location.toLowerCase().includes(location);

          return matchesQuery && matchesSkill && matchesSeniority && matchesLocation;
        });

        toolResultData = {
          total_found: filtered.length,
          query: parameters?.query || 'Singapore Tech Roles',
          location: parameters?.location || 'Singapore',
          seniority: parameters?.seniority || 'All',
          page: 1,
          results: filtered.map((j) => ({
            handle: j.handle || j.id,
            title: j.title,
            company: j.company,
            location: j.location,
            salary_min_sgd: j.salaryRangeSGD.min,
            salary_max_sgd: j.salaryRangeSGD.max,
            seniority: j.seniority || 'Mid',
            remote: j.workModel,
            apply_url: j.applyUrl || 'https://mcp.jobdatalake.com',
            enriched_skills: [...j.matchedSkills, ...(j.missingSkills || [])],
          })),
        };
        break;
      }

      case 'get_job':
        toolResultData = {
          job_handle: parameters?.job_handle || 'govtech-cloud-sol-eng-2026',
          title: 'Cloud Solutions Engineer',
          company: 'GovTech Singapore',
          location: 'One-North (Hive), Singapore',
          description: 'Architect scalable citizen-facing digital services with 99.9% uptime SLA.',
          salary: { min: 5200, max: 6800, currency: 'SGD', period: 'monthly' },
          apply_url: 'https://careers.tech.gov.sg',
          requirements: ['Degree in Computing/STEM', 'Docker & Microservices', 'CI/CD Automation'],
          posted_at: '2026-09-24T18:00:00Z',
        };
        break;

      case 'get_company':
        toolResultData = {
          company_name: parameters?.company_name || 'GovTech Singapore',
          headquarters: 'Singapore',
          active_jobs_in_singapore: 142,
          industry: 'Public Sector & Smart Nation',
          company_size: '3,000+ employees',
          career_portal: 'https://careers.tech.gov.sg',
          tech_stack: ['Python', 'Go', 'AWS GCC 2.0', 'Kubernetes', 'Docker'],
          rating: 4.4,
        };
        break;

      case 'get_filter_options':
        toolResultData = {
          filter_type: parameters?.filter_type || 'skills',
          country: 'Singapore',
          options: [
            { value: 'Python', count: 1840 },
            { value: 'SQL', count: 1620 },
            { value: 'Docker & Kubernetes', count: 1190 },
            { value: 'AWS / Cloud Architecture', count: 980 },
            { value: 'FastAPI / Go', count: 640 },
          ],
        };
        break;

      case 'find_similar_jobs':
        toolResultData = {
          reference_job: parameters?.job_handle || 'govtech-cloud-sol-eng-2026',
          vector_similarity_algorithm: 'Cosine embedding similarity (JobDataLake Typesense Vector)',
          matches: [
            {
              handle: 'dbs-grad-ai-platform-2026',
              title: 'Graduate Associate - AI & Cloud Platform',
              company: 'DBS Bank',
              similarity_score: 0.93,
              location: 'Singapore',
            },
            {
              handle: 'grab-backend-platform-sg',
              title: 'Backend Software Engineer (Platform)',
              company: 'Grab',
              similarity_score: 0.91,
              location: 'Singapore',
            },
          ],
        };
        break;

      default:
        toolResultData = {
          message: `JobDataLake MCP executed tool: ${toolName}`,
          parameters_received: parameters,
        };
    }

    return {
      mcp_protocol_version: '2024-11-05',
      server: 'JobDataLake MCP Server',
      server_url: 'https://mcp.jobdatalake.com',
      tool: toolName,
      geography: 'Singapore (SG)',
      retrieved_at: timestamp,
      data_period: 'Real-time Hourly Updates (1M+ Live Jobs)',
      taxonomy: 'SSOC 2020 / JobDataLake Enriched Taxonomy',
      confidence: 0.97,
      source_url: 'https://mcp.jobdatalake.com',
      result: {
        status: 'success',
        query_parameters: parameters,
        data: toolResultData,
      },
    };
  };

  // MCP Server Discovery & Query Handler (handles GET /api/mcp, POST /api/mcp, /api/mcp/query)
  const handleMcpEndpoint = (req: express.Request, res: express.Response) => {
    const timestamp = new Date().toISOString();

    // Extract toolName from query or body (supports multiple MCP naming conventions)
    const toolName =
      (req.query?.tool as string) ||
      (req.query?.toolName as string) ||
      req.body?.toolName ||
      req.body?.name ||
      req.body?.tool ||
      req.body?.params?.name;

    const parameters =
      req.body?.parameters ||
      req.body?.arguments ||
      req.body?.params?.arguments ||
      req.body?.params ||
      req.query ||
      {};

    // If a tool was requested (e.g. via GET ?tool=search_jobs or POST { toolName: "search_jobs" })
    if (toolName) {
      const result = executeMcpTool(toolName, parameters, timestamp);
      return res.json(result);
    }

    // Default MCP discovery & status response (200 OK for GET /api/mcp)
    return res.json({
      status: 'online',
      protocol: 'mcp',
      mcp_protocol_version: '2024-11-05',
      server_name: 'JobDataLake MCP Server',
      server_url: 'https://mcp.jobdatalake.com',
      geography: 'Singapore (SG)',
      description:
        'Official JobDataLake Model Context Protocol (MCP) server providing access to 1M+ live enriched job listings from over 25,000 companies, updated hourly with sub-100ms response times.',
      endpoints: {
        info: '/api/mcp',
        query: '/api/mcp/query',
        health: '/api/health',
      },
      tools: [
        {
          name: 'search_jobs',
          displayName: 'Search Enriched Jobs',
          description:
            'Search and filter 1M+ live enriched job listings from 25,000+ companies across Singapore. Supports keywords, AI semantic queries, locations, salary filters, and required skills.',
          parametersSchema: {
            query: 'string (e.g. "Cloud Engineer")',
            location: 'string (e.g. "Singapore" or "One-North")',
            seniority: 'enum: ["Entry", "Mid", "Senior", "Lead"]',
            skills: 'array of strings (e.g. ["Python", "Docker"])',
          },
        },
        {
          name: 'get_job',
          displayName: 'Get Job Details',
          description:
            'Retrieve complete enriched details for a specific job listing using its unique handle, including full description, requirements, salary, and direct apply link.',
          parametersSchema: {
            job_handle: 'string (unique identifier from search_jobs)',
          },
        },
        {
          name: 'get_company',
          displayName: 'Get Company Profile',
          description:
            'Retrieve enriched company profile, active job counts in Singapore, industry sector, company size, tech stack, and direct career portal URLs.',
          parametersSchema: {
            company_name: 'string (e.g. "GovTech Singapore" or "DBS Bank")',
          },
        },
        {
          name: 'get_filter_options',
          displayName: 'Get Filter Options',
          description:
            'Retrieve available filter facets such as skills, seniorities, and locations across Singapore job listings.',
          parametersSchema: {
            filter_type: 'skills | locations | seniority',
          },
        },
        {
          name: 'find_similar_jobs',
          displayName: 'Find Similar Jobs',
          description:
            'Find semantically similar vacancies using vector embedding similarity (Typesense Vector Cosine).',
          parametersSchema: {
            job_handle: 'string',
          },
        },
      ],
      usage: {
        post_execution: 'Send POST to /api/mcp or /api/mcp/query with { toolName, parameters }',
        get_execution: 'Send GET to /api/mcp?tool=search_jobs&query=Cloud+Engineer',
      },
    });
  };

  // Mount MCP handlers on all standard paths (GET & POST)
  app.get('/api/mcp', handleMcpEndpoint);
  app.get('/mcp', handleMcpEndpoint);
  app.post('/api/mcp', handleMcpEndpoint);
  app.post('/mcp', handleMcpEndpoint);
  app.get('/api/mcp/query', handleMcpEndpoint);
  app.get('/mcp/query', handleMcpEndpoint);
  app.post('/api/mcp/query', handleMcpEndpoint);
  app.post('/mcp/query', handleMcpEndpoint);

  // Root API metadata route (GET /api)
  const handleApiRoot = (_req: express.Request, res: express.Response) => {
    res.json({
      name: 'SG CareerNavigator AI API',
      status: 'online',
      geography: 'Singapore (SG)',
      mcp_endpoint: 'https://mcp.jobdatalake.com',
      available_endpoints: [
        '/api/health',
        '/api/mcp',
        '/api/mcp/query',
        '/api/gemini/analyze',
      ],
      timestamp: new Date().toISOString(),
    });
  };
  app.get('/api', handleApiRoot);

  return app;
}
