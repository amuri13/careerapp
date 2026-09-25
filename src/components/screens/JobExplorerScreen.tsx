import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Layers,
} from 'lucide-react';
import { JobOpportunity, StudentProfile } from '../../types';
import { LIVE_JOB_POSTINGS } from '../../data/singaporeLmiData';
import { JobDataLakeJobModal } from '../JobDataLakeJobModal';

interface JobExplorerScreenProps {
  profile: StudentProfile;
  onNavigateToReviews: (companyName: string) => void;
}

export const JobExplorerScreen: React.FC<JobExplorerScreenProps> = ({
  profile,
  onNavigateToReviews,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [minSalary, setMinSalary] = useState(4000);
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobOpportunity | null>(null);

  const filteredJobs = LIVE_JOB_POSTINGS.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.matchedSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesIndustry =
      selectedIndustry === 'all' || job.industry.includes(selectedIndustry);

    const matchesLocation =
      selectedLocation === 'all' || job.location.includes(selectedLocation);

    const matchesSalary = job.salaryRangeSGD.max >= minSalary;

    return matchesSearch && matchesIndustry && matchesLocation && matchesSalary;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>JobDataLake MCP (search_jobs & get_job)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Singapore Job Explorer (JobDataLake MCP)
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Live enriched vacancies aggregated directly from company career portals across Singapore tech hubs via <strong>https://mcp.jobdatalake.com</strong>. AI-enriched with verified salary ranges, required skills, and vector similarity matching.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1 shrink-0">
            <div className="font-bold text-slate-800">JobDataLake Live Feed:</div>
            <div className="text-slate-600">Hourly Updates • 25k+ Companies</div>
            <div className="text-emerald-700 font-semibold">Sub-100ms Query Latency</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Search by Title, Company, or Skill
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Cloud Engineer, GovTech, Python, Kubernetes..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Industry Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Industry Sector
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Industries</option>
              <option value="Public Sector">Public Sector & Smart Nation</option>
              <option value="Financial Services">Financial Services & Banking</option>
              <option value="Infocomm Technology">Infocomm & Superapps</option>
              <option value="Green Economy">Green Economy & Decarbonization</option>
              <option value="Electronics">Electronics & Semiconductor</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Singapore Location Cluster
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Locations</option>
              <option value="One-North">One-North (Tech Cluster)</option>
              <option value="Marina Bay">Marina Bay CBD / Downtown</option>
              <option value="Science Park">Science Park</option>
              <option value="Woodlands">Woodlands Industrial Park</option>
              <option value="Kallang">Kallang / Central</option>
            </select>
          </div>
        </div>

        {/* Salary Slider & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">
              Min Salary: SGD ${minSalary.toLocaleString()} / mo
            </span>
            <input
              type="range"
              min="3000"
              max="7000"
              step="200"
              value={minSalary}
              onChange={(e) => setMinSalary(parseInt(e.target.value))}
              className="w-48 accent-blue-600"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Found <strong>{filteredJobs.length}</strong> matching vacancies via JobDataLake MCP
          </span>
        </div>
      </div>

      {/* Jobs Listing Grid */}
      <div className="space-y-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 shadow-xs transition-all hover:shadow-md space-y-4"
          >
            {/* Top Row: Job Title, Company, Alignment Score */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-black text-blue-700 text-sm shrink-0">
                  {job.logoText}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">
                    {job.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                    <button
                      onClick={() => onNavigateToReviews(job.company)}
                      className="font-bold text-blue-700 hover:underline flex items-center gap-1"
                    >
                      {job.company}
                      <MessageSquare className="w-3 h-3" />
                    </button>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {job.workModel}
                    </span>
                    {job.seniority && (
                      <>
                        <span>•</span>
                        <span className="text-blue-700 font-medium">{job.seniority} Level</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Match Score & Salary */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                <div className="text-right">
                  <div className="text-xl font-extrabold text-blue-700">
                    SGD ${job.salaryRangeSGD.min.toLocaleString()} - ${job.salaryRangeSGD.max.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Monthly Gross</div>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 mt-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{job.alignmentScore}% Profile Fit</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {job.description}
            </p>

            {/* Skills Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Matched Candidate Strengths ({job.matchedSkills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {job.matchedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1 mb-1.5">
                  Additional Job Requirements ({job.missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {job.missingSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[11px] font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: View Job Details (JobDataLake MCP) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>Source: <strong className="text-slate-700">{job.source}</strong></span>
                <span>•</span>
                <span>Updated: {job.postedDate}</span>
                <span>•</span>
                <span className="font-mono">SSOC {job.ssocCode}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateToReviews(job.company)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span>Company Profile</span>
                </button>

                <button
                  onClick={() => setSelectedJobForModal(job)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inspect Job & Similar Roles (MCP)</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* JobDataLake Job Modal */}
      {selectedJobForModal && (
        <JobDataLakeJobModal
          job={selectedJobForModal}
          profile={profile}
          isOpen={Boolean(selectedJobForModal)}
          onClose={() => setSelectedJobForModal(null)}
        />
      )}
    </div>
  );
};
