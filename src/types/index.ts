export type EducationLevel =
  | 'Polytechnic Diploma'
  | "Bachelor's Degree"
  | "Master's Degree"
  | 'Doctorate / PhD'
  | 'ITE Higher Nitec / Nitec'
  | 'Postgraduate Diploma';

export interface StudentProfile {
  id: string;
  name: string;
  avatar?: string;
  educationLevel: EducationLevel;
  institution: string;
  fieldOfStudy: string;
  graduationYear: number;
  gpaOrHonours?: string;
  skills: string[];
  softSkills: string[];
  experience: {
    title: string;
    organization: string;
    duration: string;
    description: string;
  }[];
  interests: string[];
  preferredIndustries: string[];
  preferredLocations: string[];
  targetMonthlySalarySGD: number;
  summary: string;
}

export interface EvidenceRationale {
  careerId: string;
  careerTitle: string;
  profileEvidence: string[];
  labourMarketEvidence: string[];
  skillsEvidence: {
    matched: string[];
    transferable: string[];
    gapSkills: string[];
  };
  educationAlignment: {
    ssecCode?: string;
    degreeRelevance: 'Direct Match' | 'High Complementarity' | 'Adjacent Field';
    rationale: string;
  };
  dataSources: {
    name: string;
    publication: string;
    date: string;
    geography: string;
    url?: string;
  }[];
  uncertaintyOrMissingInfo: string[];
}

export interface CareerOption {
  id: string;
  title: string;
  ssocCode: string; // Singapore Standard Occupational Classification 2020
  ssicSector: string; // Singapore Standard Industrial Classification 2020
  matchScore: number; // 0 - 100
  educationAlignment: 'Direct' | 'High' | 'Moderate';
  skillsMatchPercentage: number;
  experienceAlignment: 'Direct' | 'Transferable' | 'Entry-Level Appropriate';
  marketDemandLevel: 'Very High' | 'High' | 'Moderate' | 'Emerging';
  momDemandGrowthRate: string; // e.g. "+14.2% YoY"
  salarySGD: {
    p25: number;
    median: number;
    p75: number;
  };
  description: string;
  keyResponsibilities: string[];
  requiredEducation: string;
  topSkillsRequired: string[];
  emergingSkills: string[];
  topEmployersSG: string[];
  tradeOffs: {
    pros: string[];
    challenges: string[];
  };
  evidenceRationale: EvidenceRationale;
}

export interface CareerPathwayNode {
  stage: 'Current Profile' | 'Entry Career (0-2 yrs)' | 'Mid-Level Specialization (2-5 yrs)' | 'Senior & Strategic (5+ yrs)' | 'Adjacent / Lateral Pivot';
  title: string;
  typicalYearsExperience: string;
  salaryRangeSGD: string;
  ssocCode?: string;
  responsibilities: string[];
  skillsRequired: string[];
  skillsToUnlockNextStage: string[];
  sampleRoles: string[];
}

export interface JobOpportunity {
  id: string;
  handle?: string;
  title: string;
  company: string;
  logoText: string;
  ssocCode: string;
  ssicSector: string;
  industry: string;
  location: string;
  workModel: 'Hybrid' | 'On-site' | 'Remote';
  seniority?: 'Entry' | 'Mid' | 'Senior';
  salaryRangeSGD: {
    min: number;
    max: number;
  };
  postedDate: string;
  alignmentScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  requirements: string[];
  description: string;
  source: string; // 'JobDataLake MCP (mcp.jobdatalake.com)'
  applyUrl?: string;
  vectorSimilarityScore?: number;
}

export interface CompanyReview {
  company: string;
  industry: string;
  companySize?: string;
  activeJobCountInSG?: number;
  careerPageUrl?: string;
  overallRating: number; // 1.0 - 5.0
  recommendToFriendPercent: number;
  ratingsBreakdown: {
    workLifeBalance: number;
    careerOpportunities: number;
    compAndBenefits: number;
    seniorManagement: number;
    cultureAndValues: number;
  };
  totalReviewsInSG: number;
  aiProsTheme: string[];
  aiConsTheme: string[];
  sampleFeedback: {
    title: string;
    authorRole: string;
    sentiment: 'Positive' | 'Neutral' | 'Constructive';
    date: string;
    content: string;
  }[];
  source: string;
}

export interface ActionPlanItem {
  id: string;
  phase: 'Days 1-30: Foundation & Core Bridging' | 'Days 31-60: Projects & Practical Artifacts' | 'Days 61-90: Targeted Applications & Prep';
  week: number;
  title: string;
  category: 'Learning / Certification' | 'Portfolio Project' | 'Industry & Networking' | 'Application Strategy';
  description: string;
  providerOrResource: string;
  estimatedHours: number;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Essential';
}

export interface JobDataLakeMcpTool {
  name: 'search_jobs' | 'get_job' | 'get_company' | 'get_filter_options' | 'find_similar_jobs';
  displayName: string;
  description: string;
  parametersSchema: Record<string, any>;
  sampleParameters: Record<string, any>;
  sampleResponse: Record<string, any>;
}

export interface McpServerDef {
  id: string;
  name: string;
  serverUrl: string;
  category: string;
  status: 'Ready / Simulated' | 'Connected' | 'Live MCP Adapter';
  description: string;
  tools: JobDataLakeMcpTool[];
  resources: string[];
  prompts: string[];
  sampleOutput: Record<string, any>;
}

export interface McpQueryResponse {
  mcp_protocol_version: string;
  server: string;
  server_url: string;
  tool: string;
  geography: string;
  retrieved_at: string;
  data_period: string;
  taxonomy: string;
  confidence: number;
  source_url: string;
  result: {
    status: 'success' | 'error';
    query_parameters: Record<string, any>;
    data: any;
  };
}
