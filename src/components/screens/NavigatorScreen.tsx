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
} from 'lucide-react';
import { CareerOption, StudentProfile } from '../../types';
import { CAREER_OPTIONS_DB } from '../../data/singaporeLmiData';
import { ExplainModal } from '../ExplainModal';

interface NavigatorScreenProps {
  currentProfile: StudentProfile;
  onSelectCareer: (career: CareerOption) => void;
  onNavigateToDeepDive: (career: CareerOption) => void;
  onNavigateToPathways: (career: CareerOption) => void;
  onNavigateToJobExplorer?: () => void;
}

export const NavigatorScreen: React.FC<NavigatorScreenProps> = ({
  currentProfile,
  onSelectCareer,
  onNavigateToDeepDive,
  onNavigateToPathways,
}) => {
  const [selectedCareerForExplain, setSelectedCareerForExplain] = useState<CareerOption | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Evidence-Based Multi-Pathway Navigation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recommended Career Pathways for {currentProfile.name}
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              We present multiple viable career directions grounded in Singapore labour-market evidence, education taxonomy (SSEC/SSOC 2020), and JobDataLake live postings. You retain full autonomy—explore trade-offs and choose the path that best matches your personal ambition.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 shrink-0 max-w-xs">
            <div className="font-bold text-slate-900">Student Baseline:</div>
            <div className="text-slate-600">
              {currentProfile.educationLevel} in {currentProfile.fieldOfStudy}
            </div>
            <div className="text-blue-700 font-semibold">
              Target Salary: SGD ${currentProfile.targetMonthlySalarySGD.toLocaleString()} / mo
            </div>
          </div>
        </div>
      </div>

      {/* Career Cards List */}
      <div className="space-y-6">
        {CAREER_OPTIONS_DB.map((career) => (
          <div
            key={career.id}
            className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 sm:p-8 shadow-xs transition-all hover:shadow-md relative overflow-hidden"
          >
            {/* Top Row: Title, Match Score, SSOC Code */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {career.title}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 font-medium">
                    {career.ssocCode.split('/')[0].trim()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sector: <span className="font-medium text-slate-700">{career.ssicSector}</span>
                </p>
              </div>

              {/* Match Score & Evidence Trigger */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-black text-blue-700">
                    {career.matchScore}%
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    Alignment Score
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCareerForExplain(career)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Explain Recommendation</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed my-4">
              {career.description}
            </p>

            {/* Evidence Breakdown Grid (8 Pillars) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100 bg-slate-50/60 rounded-xl px-4 my-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                  Education Fit
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {career.educationAlignment} Match (SSEC)
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                  Skills Overlap
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {career.skillsMatchPercentage}% Match
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                  MOM Demand Outlook
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {career.momDemandGrowthRate}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                  Median Salary (SGD)
                </span>
                <span className="text-xs font-bold text-blue-700">
                  SGD ${career.salarySGD.median.toLocaleString()} / mo
                </span>
              </div>
            </div>

            {/* Trade-offs Section (Objective Multi-Pathway Analysis) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-1">
                  Advantages & Upsides
                </span>
                <ul className="space-y-1">
                  {career.tradeOffs.pros.map((pro, idx) => (
                    <li key={idx} className="text-xs text-emerald-950 flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-1">
                  Key Challenges & Trade-offs
                </span>
                <ul className="space-y-1">
                  {career.tradeOffs.challenges.map((ch, idx) => (
                    <li key={idx} className="text-xs text-amber-950 flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{ch}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions: Deep Dive & Career Pathways */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <div className="flex flex-wrap gap-1.5 items-center text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Top SG Employers: </span>
                {career.topEmployersSG.slice(0, 3).map((emp) => (
                  <span
                    key={emp}
                    className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[11px]"
                  >
                    {emp}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectCareer(career);
                    onNavigateToPathways(career);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <GitFork className="w-3.5 h-3.5 text-indigo-600" />
                  <span>View Progression Pathway</span>
                </button>

                <button
                  onClick={() => {
                    onSelectCareer(career);
                    onNavigateToDeepDive(career);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Occupation Deep Dive</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explain My Recommendation Modal */}
      {selectedCareerForExplain && (
        <ExplainModal
          career={selectedCareerForExplain}
          profile={currentProfile}
          isOpen={Boolean(selectedCareerForExplain)}
          onClose={() => setSelectedCareerForExplain(null)}
        />
      )}
    </div>
  );
};
