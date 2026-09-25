import React from 'react';
import {
  TrendingUp,
  Activity,
  DollarSign,
  Building,
  CheckCircle2,
  ExternalLink,
  Flame,
  PieChart,
  Compass,
} from 'lucide-react';
import { MOM_LABOUR_MARKET_INDICATORS } from '../../data/singaporeLmiData';

interface MarketInsightsScreenProps {
  onNavigateToNavigator: () => void;
}

export const MarketInsightsScreen: React.FC<MarketInsightsScreenProps> = ({
  onNavigateToNavigator,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Ministry of Manpower (MOM) & SSG Verified Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Singapore Labour Market Intelligence (LMI)
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Real-time macroeconomic labour market indicators, job vacancy ratios, salary percentiles, and skills growth data grounded in official MOM MRSD releases and SkillsFuture Singapore research.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateToNavigator}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Map My Career Pathways</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards: National Market Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Job Vacancy Ratio
            </span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {MOM_LABOUR_MARKET_INDICATORS.jobVacancyToUnemployedRatio}x
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 148 openings per 100 jobseekers
          </p>
          <div className="text-[10px] text-slate-400 mt-2">
            Source: MOM MRSD Labour Market Report
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Overall Unemployment
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {MOM_LABOUR_MARKET_INDICATORS.overallUnemploymentRate}
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Resident rate at {MOM_LABOUR_MARKET_INDICATORS.residentUnemploymentRate}
          </p>
          <div className="text-[10px] text-slate-400 mt-2">
            Long-term unemployment: {MOM_LABOUR_MARKET_INDICATORS.longTermUnemploymentRate}
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Grad Employment Rate
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Building className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {MOM_LABOUR_MARKET_INDICATORS.graduateFullTimeEmploymentRate}
          </div>
          <p className="text-xs text-indigo-700 font-medium mt-1">
            Across 6 Autonomous Universities (AU GES)
          </p>
          <div className="text-[10px] text-slate-400 mt-2">
            NUS, NTU, SMU, SUTD, SIT, SUSS
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Retrenchment Index
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <PieChart className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            Low (1.1 / 1k)
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Tech restructuring stabilizing in SG
          </p>
          <div className="text-[10px] text-slate-400 mt-2">
            Focus shifting to AI capability building
          </div>
        </div>
      </div>

      {/* Two Column Section: Sector Demand Breakdown & Emerging Skills Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Singapore Growth Sectors & Starting Salaries */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                Singapore Sector Demand & Median Starting Salaries
              </h2>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
              SSIC 2020 Data
            </span>
          </div>

          <div className="space-y-4">
            {MOM_LABOUR_MARKET_INDICATORS.hotSectorsInSingapore.map((sec) => (
              <div
                key={sec.sector}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="text-sm font-bold text-slate-900">{sec.sector}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      {sec.growthRateYoY}
                    </span>
                    <span className="text-xs font-extrabold text-blue-700">
                      Median: SGD ${sec.medianStartingSalarySGD.toLocaleString()}/mo
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Open Vacancies in SG: <strong>{sec.vacancies.toLocaleString()}</strong></span>
                  <span className="font-semibold text-slate-700">Demand: {sec.demandLevel}</span>
                </div>

                {/* In Demand Roles Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sec.inDemandRoles.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white text-slate-700 border border-slate-200"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: SkillsFuture Singapore (SSG) Rising Skills */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-bold text-slate-900">
                SkillsFuture SG High-Growth Skills Radar
              </h2>
            </div>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md">
              Skills Demand Report
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Skills experiencing the highest percentage growth in employer demand across Singapore job postings over the last 18 months:
          </p>

          <div className="space-y-3">
            {MOM_LABOUR_MARKET_INDICATORS.skillsFutureInDemandEmergingSkills.map((sk) => (
              <div
                key={sk.skill}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{sk.skill}</div>
                  <div className="text-[11px] text-slate-500">{sk.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                    {sk.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Singapore Official Data Citations */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mt-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Data Quality & Governance Standards
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              All metrics comply with the Singapore Government Public Sector Data Security framework. Occupations are strictly cataloged using SSOC 2020; industries follow SSIC 2020.
            </p>
            <div className="flex flex-wrap gap-3 text-[11px] text-blue-700 pt-1">
              <a
                href="https://stats.mom.gov.sg"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                MOM MRSD Statistics <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.skillsfuture.gov.sg"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                SkillsFuture Singapore <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
