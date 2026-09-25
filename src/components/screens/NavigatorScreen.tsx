import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  TrendingUp,
  ChevronRight,
  HelpCircle,
  Briefcase,
  GitFork,
  DollarSign,
  Building,
  Search,
  Layers,
} from 'lucide-react';
import { CareerOption } from '../../types';
import { CAREER_OPTIONS_DB } from '../../data/singaporeLmiData';
import { ExplainModal } from '../ExplainModal';

interface NavigatorScreenProps {
  onSelectCareer: (career: CareerOption) => void;
  onNavigateToDeepDive: (career: CareerOption) => void;
  onNavigateToPathways: (career: CareerOption) => void;
  onNavigateToJobExplorer?: () => void;
}

export const NavigatorScreen: React.FC<NavigatorScreenProps> = ({
  onSelectCareer,
  onNavigateToDeepDive,
  onNavigateToPathways,
  onNavigateToJobExplorer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCareerForExplain, setSelectedCareerForExplain] = useState<CareerOption | null>(null);

  const filteredCareers = CAREER_OPTIONS_DB.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.topSkillsRequired.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.ssicSector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Singapore Occupational Frameworks & Pathways</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              In-Demand Singapore Career Roles & Trajectories
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Explore strategic tech and green economy roles mapped against official MOM MRSD salary percentiles, SkillsFuture Singapore competency frameworks, and JobDataLake live postings.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 shrink-0 max-w-xs">
            <div className="font-bold text-slate-900">MOM MRSD Market Context:</div>
            <div className="text-slate-600">
              National Tech Median: <strong>SGD $6,200 / mo</strong>
            </div>
            <div className="text-emerald-700 font-semibold">
              Vacancy-to-Unemployed Ratio: 1.48x
            </div>
          </div>
        </div>

        {/* Quick Search */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pathways by title or skill (e.g. Cloud, Python, AI)..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {onNavigateToJobExplorer && (
            <button
              onClick={onNavigateToJobExplorer}
              className="flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 font-semibold self-start sm:self-auto"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Search Live Vacancies in Job Explorer</span>
            </button>
          )}
        </div>
      </div>

      {/* Career Cards List */}
      <div className="space-y-6">
        {filteredCareers.map((career) => (
          <div
            key={career.id}
            className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 sm:p-8 shadow-xs transition-all hover:shadow-md relative overflow-hidden"
          >
            {/* Top Row: Title, Match Score, SSOC Code */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {career.title}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 font-medium">
                    {career.ssocCode.split('/')[0].trim()}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{career.momDemandGrowthRate} Demand</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Sector: {career.ssicSector}
                </p>
              </div>

              {/* Salary & Match Score */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    MOM Median Gross
                  </span>
                  <span className="text-lg font-black text-blue-700">
                    SGD ${career.salarySGD.median.toLocaleString()} / mo
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    P25: ${career.salarySGD.p25.toLocaleString()} • P75: ${career.salarySGD.p75.toLocaleString()}
                  </span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex flex-col items-center">
                  <span>{career.matchScore}%</span>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-700 font-semibold">
                    Market Index
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="py-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {career.description}
              </p>
            </div>

            {/* Middle Grid: Skills & Employers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-slate-100 text-xs">
              {/* Core Skills */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">
                  Critical Technical Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {career.topSkillsRequired.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {career.emergingSkills.slice(0, 2).map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{skill} (Emerging)</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Singapore Employers Hiring */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>Key Singapore Employers:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {career.topEmployersSG.map((emp) => (
                    <span
                      key={emp}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                    >
                      {emp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trade-Offs Snapshot */}
            <div className="py-3 px-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <strong className="text-emerald-800 block mb-1">
                  Key Upsides:
                </strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  {career.tradeOffs.pros.slice(0, 2).map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-amber-800 block mb-1">
                  Key Challenges & Rigour:
                </strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  {career.tradeOffs.challenges.slice(0, 2).map((ch, i) => (
                    <li key={i}>{ch}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setSelectedCareerForExplain(career)}
                className="flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 font-bold self-start sm:self-auto"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Explain LMI Evidence & Taxonomies</span>
              </button>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => onNavigateToPathways(career)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <GitFork className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Progression Pathway</span>
                </button>

                <button
                  onClick={() => onNavigateToDeepDive(career)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Role Deep Dive</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explain Evidence Modal */}
      {selectedCareerForExplain && (
        <ExplainModal
          career={selectedCareerForExplain}
          isOpen={!!selectedCareerForExplain}
          onClose={() => setSelectedCareerForExplain(null)}
        />
      )}
    </div>
  );
};
