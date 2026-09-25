import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Layers,
  X,
  Plus,
  SlidersHorizontal,
  DollarSign,
  TrendingUp,
  Compass,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { JobOpportunity } from '../../types';
import {
  LIVE_JOB_POSTINGS,
  POPULAR_SKILLS,
  POPULAR_JOB_TITLES,
} from '../../data/singaporeLmiData';
import { JobDataLakeJobModal } from '../JobDataLakeJobModal';

interface JobExplorerScreenProps {
  onNavigateToReviews: (companyName: string) => void;
  onNavigateToPathways?: (roleTitle?: string) => void;
}

export const JobExplorerScreen: React.FC<JobExplorerScreenProps> = ({
  onNavigateToReviews,
  onNavigateToPathways,
}) => {
  // Search state
  const [titleSearch, setTitleSearch] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Faceted filters
  const [selectedSeniority, setSelectedSeniority] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedWorkModel, setSelectedWorkModel] = useState('all');
  const [minSalary, setMinSalary] = useState(3000);
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'recent'>('match');

  // Modal state
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobOpportunity | null>(null);

  // Toggle or add a skill
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleResetFilters = () => {
    setTitleSearch('');
    setSelectedSkills([]);
    setSelectedSeniority('all');
    setSelectedIndustry('all');
    setSelectedLocation('all');
    setSelectedWorkModel('all');
    setMinSalary(3000);
    setSortBy('match');
  };

  // Filter & Rank Jobs
  const filteredAndRankedJobs = useMemo(() => {
    return LIVE_JOB_POSTINGS.map((job) => {
      // Collect all skills mentioned in the job
      const jobAllSkills = [
        ...(job.matchedSkills || []),
        ...(job.missingSkills || []),
      ];

      // Calculate dynamic user skill match if user has selected skills
      let dynamicMatchScore = job.alignmentScore;
      let userMatchedSkills: string[] = [];
      let userMissingSkills: string[] = [];

      if (selectedSkills.length > 0) {
        userMatchedSkills = selectedSkills.filter((userSkill) =>
          jobAllSkills.some(
            (jobSkill) =>
              jobSkill.toLowerCase().includes(userSkill.toLowerCase()) ||
              userSkill.toLowerCase().includes(jobSkill.toLowerCase())
          )
        );

        userMissingSkills = selectedSkills.filter(
          (userSkill) => !userMatchedSkills.includes(userSkill)
        );

        const matchRatio = userMatchedSkills.length / selectedSkills.length;
        dynamicMatchScore = Math.round(50 + matchRatio * 50);
      } else {
        userMatchedSkills = job.matchedSkills;
        userMissingSkills = job.missingSkills;
      }

      return {
        ...job,
        dynamicMatchScore,
        userMatchedSkills,
        userMissingSkills,
        jobAllSkills,
      };
    })
      .filter((job) => {
        // Title or Company Search
        const titleMatch =
          !titleSearch ||
          job.title.toLowerCase().includes(titleSearch.toLowerCase()) ||
          job.company.toLowerCase().includes(titleSearch.toLowerCase()) ||
          job.jobAllSkills.some((s) =>
            s.toLowerCase().includes(titleSearch.toLowerCase())
          );

        // Required Skill Filter: If user selected skills, require at least one match if skills filter active
        const skillMatch =
          selectedSkills.length === 0 || job.userMatchedSkills.length > 0;

        // Seniority
        const seniorityMatch =
          selectedSeniority === 'all' || job.seniority === selectedSeniority;

        // Industry
        const industryMatch =
          selectedIndustry === 'all' || job.industry.includes(selectedIndustry);

        // Location
        const locationMatch =
          selectedLocation === 'all' || job.location.includes(selectedLocation);

        // Work Model
        const workModelMatch =
          selectedWorkModel === 'all' || job.workModel === selectedWorkModel;

        // Salary
        const salaryMatch = job.salaryRangeSGD.max >= minSalary;

        return (
          titleMatch &&
          skillMatch &&
          seniorityMatch &&
          industryMatch &&
          locationMatch &&
          workModelMatch &&
          salaryMatch
        );
      })
      .sort((a, b) => {
        if (sortBy === 'salary') {
          return b.salaryRangeSGD.max - a.salaryRangeSGD.max;
        }
        if (sortBy === 'recent') {
          return a.id.localeCompare(b.id);
        }
        // default match
        return b.dynamicMatchScore - a.dynamicMatchScore;
      });
  }, [
    titleSearch,
    selectedSkills,
    selectedSeniority,
    selectedIndustry,
    selectedLocation,
    selectedWorkModel,
    minSalary,
    sortBy,
  ]);

  // Aggregate Market Stats
  const avgSalary = useMemo(() => {
    if (filteredAndRankedJobs.length === 0) return 0;
    const sum = filteredAndRankedJobs.reduce(
      (acc, j) => acc + (j.salaryRangeSGD.min + j.salaryRangeSGD.max) / 2,
      0
    );
    return Math.round(sum / filteredAndRankedJobs.length);
  }, [filteredAndRankedJobs]);

  // Top co-occurring skills in current results
  const topCoOccurringSkills = useMemo(() => {
    const skillCounts: Record<string, number> = {};
    filteredAndRankedJobs.forEach((job) => {
      job.jobAllSkills.forEach((s) => {
        if (!selectedSkills.includes(s)) {
          skillCounts[s] = (skillCounts[s] || 0) + 1;
        }
      });
    });
    return Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([skill]) => skill);
  }, [filteredAndRankedJobs, selectedSkills]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Hero Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>JobDataLake MCP • Live Singapore Job & Skill Search Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Search Singapore Jobs by Title & Skills
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Explore 1,000,000+ enriched job listings scraped directly from over 25,000 employer career portals across Singapore via <strong>https://mcp.jobdatalake.com</strong>. Search freely by job title or filter by specific technical skills with sub-100ms vector matching.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1.5 shrink-0 max-w-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">JobDataLake Live Feed:</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-slate-600">Hourly Updates • 25k+ Companies</div>
            <div className="text-emerald-700 font-semibold">Real-Time Vector Semantic Search</div>
          </div>
        </div>
      </div>

      {/* Main Search & Filter Control Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        {/* Search Bar 1: Job Title / Company Search */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Search by Job Title or Employer:
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={titleSearch}
              onChange={(e) => setTitleSearch(e.target.value)}
              placeholder="e.g. Software Engineer, Cloud Solutions, Frontend Developer, GovTech, DBS, Grab..."
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-slate-400"
            />
            {titleSearch && (
              <button
                type="button"
                onClick={() => setTitleSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Title Shortcuts */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2">
            <span className="text-[11px] font-semibold text-slate-500">Popular Searches:</span>
            {POPULAR_JOB_TITLES.slice(0, 6).map((title) => (
              <button
                key={title}
                type="button"
                onClick={() => setTitleSearch(title)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors border ${
                  titleSearch === title
                    ? 'bg-blue-600 text-white border-blue-600 font-medium'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar 2: Skills Search & Multi-Tag Selection */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Filter by Skills (Multi-select to calculate match percentage):
            </label>
            {selectedSkills.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedSkills([])}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold self-start sm:self-auto"
              >
                Clear all selected skills ({selectedSkills.length})
              </button>
            )}
          </div>

          {/* Custom Skill Input Form */}
          <form onSubmit={handleAddCustomSkill} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Type any skill (e.g. Python, React, Docker, Kubernetes, AWS, SQL) and press Enter..."
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={!skillInput.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </form>

          {/* Active Selected Skills Tags */}
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
              <span className="text-xs font-bold text-blue-900 mr-1">Active Skill Filters:</span>
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-2xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Quick-Click Popular Skills Cloud */}
          <div>
            <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
              Click to toggle in-demand Singapore skills:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-2xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Faceted Dropdown Filters & Salary Slider */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Seniority */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Experience Level
            </label>
            <select
              value={selectedSeniority}
              onChange={(e) => setSelectedSeniority(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
              <option value="all">All Seniority Levels</option>
              <option value="Entry">Entry-Level / Graduate (0-2 yrs)</option>
              <option value="Mid">Mid-Level (2-5 yrs)</option>
              <option value="Senior">Senior & Lead (5+ yrs)</option>
            </select>
          </div>

          {/* Location Cluster */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Location Cluster (Singapore)
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
              <option value="all">All Singapore Locations</option>
              <option value="One-North">One-North (Tech Cluster)</option>
              <option value="Marina Bay">Marina Bay CBD / Downtown</option>
              <option value="Science Park">Science Park</option>
              <option value="Woodlands">Woodlands Industrial Park</option>
              <option value="Kallang">Kallang / Central</option>
              <option value="Changi">Changi Business Park</option>
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Industry Sector
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
              <option value="all">All Industry Sectors</option>
              <option value="Infocomm">Infocomm & Superapps</option>
              <option value="Financial Services">Financial Services & Banking</option>
              <option value="Public Sector">Public Sector & Smart Nation</option>
              <option value="E-Commerce">E-Commerce & Supply Chain</option>
              <option value="Green Economy">Green Economy & Decarbonization</option>
              <option value="Electronics">Electronics & Semiconductor</option>
            </select>
          </div>

          {/* Work Model */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Work Arrangement
            </label>
            <select
              value={selectedWorkModel}
              onChange={(e) => setSelectedWorkModel(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
              <option value="all">All Arrangements</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        {/* Salary Slider & Sort Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Min Salary:</span>
              <span className="font-extrabold text-blue-700">
                SGD ${minSalary.toLocaleString()} / mo
              </span>
              <input
                type="range"
                min="3000"
                max="8500"
                step="250"
                value={minSalary}
                onChange={(e) => setMinSalary(parseInt(e.target.value))}
                className="w-36 accent-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="font-bold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white font-semibold text-slate-800"
              >
                <option value="match">Best Skill Match</option>
                <option value="salary">Highest Salary</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header & Summary Analytics */}
      <div className="bg-slate-100/70 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-700">
            Found <strong>{filteredAndRankedJobs.length}</strong> matching vacancies
            {titleSearch ? ` for "${titleSearch}"` : ''}
            {selectedSkills.length > 0 ? ` with skills: ${selectedSkills.join(', ')}` : ''}
          </span>
        </div>

        {filteredAndRankedJobs.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            <div>
              Average Salary: <strong className="text-blue-700 font-bold">SGD ${avgSalary.toLocaleString()} / mo</strong>
            </div>

            {topCoOccurringSkills.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-500">Related Skills:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {topCoOccurringSkills.slice(0, 4).map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleSkill(sk)}
                      className="px-2 py-0.5 rounded bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-[11px] font-medium transition-colors"
                    >
                      + {sk}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Jobs Listing Grid */}
      {filteredAndRankedJobs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Job Postings Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            No vacancies currently match all of your combined search parameters. Try removing some skills, expanding the location cluster, or resetting the salary slider.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Search Filters</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndRankedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 shadow-xs transition-all hover:shadow-md space-y-4"
            >
              {/* Top Row: Job Title, Company, Match Score, Salary */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-black text-blue-700 text-sm shrink-0">
                    {job.logoText}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                        {job.title}
                      </h2>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        SSOC {job.ssocCode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                      <button
                        onClick={() => onNavigateToReviews(job.company)}
                        className="font-bold text-blue-700 hover:underline flex items-center gap-1"
                        title="View company reviews & culture dossier"
                      >
                        {job.company}
                        <MessageSquare className="w-3 h-3" />
                      </button>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {job.location}
                      </span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {job.workModel}
                      </span>
                      {job.seniority && (
                        <>
                          <span>•</span>
                          <span className="text-blue-700 font-semibold">{job.seniority} Level</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Score & Salary */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-lg sm:text-xl font-extrabold text-blue-700">
                      SGD ${job.salaryRangeSGD.min.toLocaleString()} - ${job.salaryRangeSGD.max.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">Monthly Gross (MOM MRSD)</div>
                  </div>

                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 mt-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>
                      {selectedSkills.length > 0
                        ? `${job.dynamicMatchScore}% Skill Fit`
                        : `${job.alignmentScore}% Market Demand`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {job.description}
              </p>

              {/* Skills Tags Breakdown */}
              <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Required & Verified Technical Skills:</span>
                  {selectedSkills.length > 0 && (
                    <span className="text-emerald-700 font-semibold lowercase">
                      {job.userMatchedSkills.length} of {selectedSkills.length} selected skills matched
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {job.jobAllSkills.map((skill) => {
                    const isMatchedByUser = selectedSkills.some(
                      (s) =>
                        s.toLowerCase().includes(skill.toLowerCase()) ||
                        skill.toLowerCase().includes(s.toLowerCase())
                    );

                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          isMatchedByUser
                            ? 'bg-emerald-100/80 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                        title="Click to toggle this skill in search filter"
                      >
                        {isMatchedByUser ? `✓ ${skill}` : skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-mono text-emerald-700 font-semibold">{job.source}</span>
                  <span>•</span>
                  <span>Posted {job.postedDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedJobForModal(job)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    View Job & Vector Match
                  </button>

                  {onNavigateToPathways && (
                    <button
                      onClick={() => onNavigateToPathways(job.title)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Career Path</span>
                    </button>
                  )}

                  <a
                    href={job.applyUrl || 'https://mcp.jobdatalake.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Apply on Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal View */}
      {selectedJobForModal && (
        <JobDataLakeJobModal
          job={selectedJobForModal}
          isOpen={!!selectedJobForModal}
          onClose={() => setSelectedJobForModal(null)}
        />
      )}
    </div>
  );
};
