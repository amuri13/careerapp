import React, { useState } from 'react';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Building,
  GraduationCap,
  CheckCircle2,
  ChevronLeft,
  HelpCircle,
  Layers,
  GitFork,
  ArrowRight,
} from 'lucide-react';
import { CareerOption } from '../../types';
import { ExplainModal } from '../ExplainModal';

interface DeepDiveScreenProps {
  career: CareerOption;
  onBackToNavigator: () => void;
  onNavigateToPathways: (career: CareerOption) => void;
  onNavigateToJobExplorer: () => void;
  onNavigateToReviews: (companyName?: string) => void;
}

export const DeepDiveScreen: React.FC<DeepDiveScreenProps> = ({
  career,
  onBackToNavigator,
  onNavigateToPathways,
  onNavigateToJobExplorer,
  onNavigateToReviews,
}) => {
  const [explainOpen, setExplainOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Title header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToNavigator}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Career Recommendations</span>
        </button>

        <button
          onClick={() => setExplainOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Explain My Recommendation</span>
        </button>
      </div>

      {/* Main Career Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
                Official SSOC: {career.ssocCode}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                SSIC Sector: {career.ssicSector}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {career.title}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Singapore Standard Occupational Classification 2020 • Manpower Research & Statistics Department
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
              <div className="text-2xl font-black text-blue-700">
                {career.matchScore}%
              </div>
              <div className="text-[10px] text-blue-900 font-semibold uppercase tracking-wider">
                Suitability Score
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed pt-2">
          {career.description}
        </p>
      </div>

      {/* Salary & Labour Demand Metrics (MOM Official Percentiles) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Salary Percentiles */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 md:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">
                MOM Singapore Monthly Salary Distribution (SGD Gross)
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              MOM MRSD 2024-2026 Survey
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                25th Percentile
              </span>
              <span className="text-lg font-black text-slate-900">
                SGD ${career.salarySGD.p25.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Entry Baseline</span>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 ring-2 ring-blue-100">
              <span className="text-[10px] text-blue-800 font-bold uppercase block mb-1">
                Median (50th)
              </span>
              <span className="text-xl font-black text-blue-700">
                SGD ${career.salarySGD.median.toLocaleString()}
              </span>
              <span className="text-[10px] text-blue-600 font-medium block mt-0.5">Market Average</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                75th Percentile
              </span>
              <span className="text-lg font-black text-slate-900">
                SGD ${career.salarySGD.p75.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">High Performance</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <strong>MOM Benchmark Guidance: </strong> The median monthly gross of{' '}
            <span className="font-bold text-blue-700">SGD ${career.salarySGD.median.toLocaleString()}/mo</span>{' '}
            provides strong economic returns, with upper-quartile earners reaching SGD ${career.salarySGD.p75.toLocaleString()}/mo in Singapore.
          </div>
        </div>

        {/* Demand Outlook */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Labour Demand Trajectory
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-500 block">Annual Vacancy Growth</span>
              <span className="text-2xl font-black text-emerald-700">
                {career.momDemandGrowthRate}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">National Hiring Priority</span>
              <span className="text-sm font-bold text-slate-900">
                {career.marketDemandLevel} Demand Tier
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
              Backed by Singapore Smart Nation 2.0 and MAS Financial Sector Development Fund (FSDF) capability roadmaps.
            </div>
          </div>
        </div>
      </div>

      {/* Responsibilities & Education Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Core Day-to-Day Responsibilities */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Day-in-the-Life Responsibilities
            </h2>
          </div>

          <ul className="space-y-2.5">
            {career.keyResponsibilities.map((resp, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Education Prerequisites & Top Skills */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900">
              Education & Skill Framework
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">
                Typical Academic Benchmark:
              </span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {career.requiredEducation}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">
                Core Technical Skills (SSG):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {career.topSkillsRequired.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">
                Emerging & High-Value Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {career.emergingSkills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Singapore Hiring Employers */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Active Singapore Hiring Employers
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Click to view company profile & open jobs
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {career.topEmployersSG.map((emp) => (
            <button
              key={emp}
              onClick={() => onNavigateToReviews(emp)}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-300 text-left transition-all"
            >
              <div className="text-xs font-bold text-slate-900 truncate">{emp}</div>
              <div className="text-[10px] text-blue-600 font-medium mt-0.5">
                View Company Dossier →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-slate-600">
          Ready to explore live positions? View real-time enriched openings or examine multi-year progression pathways.
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateToPathways(career)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <GitFork className="w-3.5 h-3.5 text-indigo-600" />
            <span>View Pathway Progression</span>
          </button>

          <button
            onClick={onNavigateToJobExplorer}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Explore Jobs on JobDataLake</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Explain Modal */}
      {explainOpen && (
        <ExplainModal
          career={career}
          isOpen={explainOpen}
          onClose={() => setExplainOpen(false)}
        />
      )}
    </div>
  );
};
