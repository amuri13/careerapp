import React, { useState } from 'react';
import {
  Cpu,
  Terminal,
  Play,
  CheckCircle2,
  Copy,
  Check,
  Server,
  Layers,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Code,
  Search,
  Building,
  Filter,
} from 'lucide-react';
import { JOBDATALAKE_MCP_SERVER } from '../../data/singaporeLmiData';
import { JobDataLakeMcpTool, McpQueryResponse } from '../../types';
import { executeJobDataLakeMcpQuery } from '../../services/api';

export const McpHubScreen: React.FC = () => {
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryOutput, setQueryOutput] = useState<McpQueryResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const activeTool: JobDataLakeMcpTool = JOBDATALAKE_MCP_SERVER.tools[selectedToolIndex] || JOBDATALAKE_MCP_SERVER.tools[0];

  const handleExecuteQuery = async () => {
    setIsQuerying(true);
    try {
      const res = await executeJobDataLakeMcpQuery(activeTool.name, activeTool.sampleParameters);
      setQueryOutput(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleCopyJson = () => {
    if (!queryOutput) return;
    navigator.clipboard.writeText(JSON.stringify(queryOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getToolIcon = (name: string) => {
    switch (name) {
      case 'search_jobs':
        return <Search className="w-4 h-4 text-blue-600" />;
      case 'get_job':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'get_company':
        return <Building className="w-4 h-4 text-indigo-600" />;
      case 'get_filter_options':
        return <Filter className="w-4 h-4 text-amber-600" />;
      case 'find_similar_jobs':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      default:
        return <Code className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Official JobDataLake MCP Integration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              JobDataLake Model Context Protocol (MCP) Server
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Standardized Model Context Protocol (MCP) tools provided by <strong>https://mcp.jobdatalake.com</strong>. Directly queries 1,000,000+ enriched job listings scraped from over 25,000 company career pages, updated hourly with sub-100ms response times.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 shrink-0">
            <div className="font-bold text-slate-900">Live Endpoint:</div>
            <div className="text-blue-700 font-mono text-[11px]">https://mcp.jobdatalake.com</div>
            <div className="text-emerald-700 font-semibold">5 Operational Tools Ready</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Tools List on Left, Interactive Runner on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: All 5 JobDataLake MCP Tools */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              JobDataLake MCP Tools
            </span>
            <span className="text-xs text-blue-700 font-semibold">5 Tools Available</span>
          </div>

          <div className="space-y-2">
            {JOBDATALAKE_MCP_SERVER.tools.map((t, idx) => {
              const isSelected = selectedToolIndex === idx;
              return (
                <button
                  key={t.name}
                  onClick={() => {
                    setSelectedToolIndex(idx);
                    setQueryOutput(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={isSelected ? 'text-white' : ''}>
                        {getToolIcon(t.name)}
                      </span>
                      <span className="font-bold text-xs font-mono">{t.name}()</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                        isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      MCP Tool
                    </span>
                  </div>
                  <p
                    className={`text-[11px] mt-1 line-clamp-2 ${
                      isSelected ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {t.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* JobDataLake Server Specifications Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-800 block">
              JobDataLake Infrastructure
            </span>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>• Endpoint: <code className="font-mono text-blue-700">mcp.jobdatalake.com</code></li>
              <li>• Refresh Cycle: Hourly Scrape (25k+ Companies)</li>
              <li>• AI Enrichment: Seniority, Salary USD/SGD, Skills</li>
              <li>• Search Engine: Typesense Vector Database</li>
              <li>• Free Tier: 500 Daily Calls without Signup</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Selected Tool Dossier & Query Console */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Tool Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900 font-mono">
                    {activeTool.name}()
                  </h2>
                </div>
                <span className="text-xs text-slate-500 mt-0.5 block">
                  {activeTool.displayName} • JobDataLake MCP Protocol
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready to Invoke</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {activeTool.description}
            </p>

            {/* Parameters Schema */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-800">Parameters Schema:</span>
              <pre className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto">
                {JSON.stringify(activeTool.parametersSchema, null, 2)}
              </pre>
            </div>
          </div>

          {/* Interactive Tool Invoker & JSON Output */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Live MCP Tool Execution
                </h3>
              </div>

              <button
                onClick={handleExecuteQuery}
                disabled={isQuerying}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
              >
                {isQuerying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing {activeTool.name}()...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Execute {activeTool.name}()</span>
                  </>
                )}
              </button>
            </div>

            {/* Request Parameters Sent */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700">Sample Query Parameters:</span>
              <pre className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">
                {JSON.stringify(activeTool.sampleParameters, null, 2)}
              </pre>
            </div>

            {/* Formatted JSON Output Console */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  JobDataLake MCP Response Payload
                </span>
                {queryOutput && (
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                )}
              </div>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-80 leading-relaxed shadow-inner">
                {queryOutput ? (
                  <pre>{JSON.stringify(queryOutput, null, 2)}</pre>
                ) : (
                  <pre className="text-slate-400">
                    // Click &ldquo;Execute {activeTool.name}()&rdquo; above to query https://mcp.jobdatalake.com...
                    {JSON.stringify(
                      {
                        mcp_server: 'https://mcp.jobdatalake.com',
                        tool: activeTool.name,
                        sample_output: activeTool.sampleResponse,
                      },
                      null,
                      2
                    )}
                  </pre>
                )}
              </div>
            </div>
          </div>

          {/* Connection Guidelines */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 space-y-2 text-xs text-blue-950">
            <h4 className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
              <span>Connecting JobDataLake MCP to Claude / Cursor / ChatGPT</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </h4>
            <p className="leading-relaxed">
              To connect <strong>https://mcp.jobdatalake.com</strong> to your local AI agents, add the following entry to your <code>mcpServers</code> configuration:
            </p>
            <pre className="p-3 bg-white border border-blue-200 rounded-xl font-mono text-[11px] text-slate-800 overflow-x-auto">
{JSON.stringify(
  {
    mcpServers: {
      jobdatalake: {
        url: "https://mcp.jobdatalake.com",
        transport: "sse"
      }
    }
  },
  null,
  2
)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
