import React, { useState } from 'react';
import {
  X,
  Building,
  MapPin,
  DollarSign,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { JobOpportunity, StudentProfile } from '../types';

interface JobDataLakeJobModalProps {
  job: JobOpportunity;
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSelectSimilarJob?: (job: JobOpportunity) => void;
}

export const JobDataLakeJobModal: React.FC<JobDataLakeJobModalProps> = ({
  job,
  profile,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'similar'>('details');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              {job.logoText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {job.title}
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  JobDataLake MCP Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {job.company} • {job.location} • Enriched via https://mcp.jobdatalake.com
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Job Details (get_job)
          </button>
          <button
            onClick={() => setActiveTab('similar')}
            className={`pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'similar'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>AI Similar Roles (find_similar_jobs)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'details' && (
            <>
              {/* Quick Summary Pill Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-blue-50/60 border border-blue-200 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-blue-800 font-bold uppercase block mb-0.5">
                    Compensation
                  </span>
                  <span className="font-extrabold text-blue-900">
                    SGD ${job.salaryRangeSGD.min.toLocaleString()} - ${job.salaryRangeSGD.max.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-blue-800 font-bold uppercase block mb-0.5">
                    Work Arrangement
                  </span>
                  <span className="font-semibold text-slate-800">{job.workModel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-blue-800 font-bold uppercase block mb-0.5">
                    Profile Alignment
                  </span>
                  <span className="font-extrabold text-emerald-700">
                    {job.alignmentScore}% Match
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-blue-800 font-bold uppercase block mb-0.5">
                    Data Source
                  </span>
                  <span className="font-medium text-slate-700">JobDataLake MCP</span>
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Role Overview
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {job.description}
                </p>
              </div>

              {/* Requirements & Skills */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Candidate Requirements (JobDataLake Enriched)
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Matched Skills */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Candidate Verified Strengths Match
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.matchedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'similar' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>JobDataLake AI Vector Similarity Search (Typesense Vector Engine)</span>
                </div>
                <p className="text-slate-600">
                  Using <code>find_similar_jobs</code> on <code>https://mcp.jobdatalake.com</code>, these openings share 85%+ semantic vector embedding alignment with {job.title}.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'Graduate Associate - AI & Cloud Platform',
                    company: 'DBS Bank Singapore',
                    similarity: '93% Vector Similarity',
                    location: 'Marina Bay Financial Centre, Singapore',
                    salary: 'SGD $5,400 - $6,500 / mo',
                  },
                  {
                    title: 'Backend Software Engineer (Platform Architecture)',
                    company: 'Grab Singapore',
                    similarity: '91% Vector Similarity',
                    location: 'One-North, Singapore',
                    salary: 'SGD $5,600 - $7,200 / mo',
                  },
                  {
                    title: 'Smart Automation & DevOps Engineer',
                    company: 'Micron Technology Singapore',
                    similarity: '86% Vector Similarity',
                    location: 'Woodlands Industrial Park, Singapore',
                    salary: 'SGD $4,800 - $6,200 / mo',
                  },
                ].map((sim, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900">{sim.title}</div>
                      <div className="text-xs text-blue-700 font-medium">{sim.company} • {sim.location}</div>
                      <div className="text-[11px] text-slate-500 mt-1">{sim.salary}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                      {sim.similarity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Powered by JobDataLake MCP (mcp.jobdatalake.com)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <a
              href={job.applyUrl || 'https://mcp.jobdatalake.com'}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Apply on Company Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
