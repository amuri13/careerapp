import React, { useState } from 'react';
import {
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Building,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  Code,
} from 'lucide-react';
import { COMPANY_REVIEWS_DB } from '../../data/singaporeLmiData';
import { CompanyReview } from '../../types';

interface EmployeeReviewsScreenProps {
  initialCompany?: string;
  onNavigateToJobs: () => void;
}

export const EmployeeReviewsScreen: React.FC<EmployeeReviewsScreenProps> = ({
  initialCompany,
  onNavigateToJobs,
}) => {
  const companies = Object.keys(COMPANY_REVIEWS_DB);
  const [selectedCompany, setSelectedCompany] = useState<string>(
    initialCompany && COMPANY_REVIEWS_DB[initialCompany]
      ? initialCompany
      : companies[0]
  );

  const review: CompanyReview = COMPANY_REVIEWS_DB[selectedCompany] || COMPANY_REVIEWS_DB[companies[0]];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Building className="w-3.5 h-3.5" />
              <span>JobDataLake MCP (get_company: https://mcp.jobdatalake.com)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Singapore Employer Profiles & Culture Dossier
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Enriched company intelligence retrieved via JobDataLake MCP <code>get_company</code>. Inspect active vacancy counts in Singapore, verified tech stacks, employee sentiment scores, and direct career portal links.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onNavigateToJobs}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <span>Explore Vacancies on JobDataLake</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Company Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {companies.map((comp) => (
          <button
            key={comp}
            onClick={() => setSelectedCompany(comp)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCompany === comp
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {comp}
          </button>
        ))}
      </div>

      {/* Selected Company Dossier */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header: Company Name & Overall Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {review.company}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Industry: <strong className="text-slate-700">{review.industry}</strong> • {review.companySize} • Source: <code className="text-blue-700 font-mono">JobDataLake get_company</code>
            </p>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-2xl font-black text-slate-900">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                <span>{review.overallRating.toFixed(1)}</span>
                <span className="text-slate-400 text-sm font-normal">/ 5.0</span>
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">
                {review.recommendToFriendPercent}% Recommend to a Friend
              </div>
            </div>
          </div>
        </div>

        {/* JobDataLake Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">
              Active SG Vacancies
            </span>
            <span className="font-extrabold text-blue-700 text-sm">
              {review.activeJobCountInSG} Openings
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">
              Singapore Team Size
            </span>
            <span className="font-semibold text-slate-800">
              {review.companySize}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">
              Verified Feedback Count
            </span>
            <span className="font-semibold text-slate-800">
              {review.totalReviewsInSG.toLocaleString()} Reviews
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">
              Career Portal
            </span>
            <a
              href={review.careerPageUrl || 'https://mcp.jobdatalake.com'}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Visit Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 5-Attribute Rating Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-center">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">
              Work-Life Balance
            </span>
            <span className="text-base font-extrabold text-slate-900">
              {review.ratingsBreakdown.workLifeBalance} / 5.0
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">
              Career Growth
            </span>
            <span className="text-base font-extrabold text-blue-700">
              {review.ratingsBreakdown.careerOpportunities} / 5.0
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">
              Comp & Benefits
            </span>
            <span className="text-base font-extrabold text-emerald-700">
              {review.ratingsBreakdown.compAndBenefits} / 5.0
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">
              Senior Leadership
            </span>
            <span className="text-base font-extrabold text-slate-900">
              {review.ratingsBreakdown.seniorManagement} / 5.0
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">
              Culture & Values
            </span>
            <span className="text-base font-extrabold text-purple-700">
              {review.ratingsBreakdown.cultureAndValues} / 5.0
            </span>
          </div>
        </div>

        {/* AI Synthesized Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Pros Theme */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              <span>AI Synthesized Positive Themes</span>
            </div>
            <ul className="space-y-2">
              {review.aiProsTheme.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-emerald-950 leading-relaxed">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Cons Theme */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <ThumbsDown className="w-4 h-4 text-amber-600" />
              <span>AI Synthesized Constructive Themes</span>
            </div>
            <ul className="space-y-2">
              {review.aiConsTheme.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-amber-950 leading-relaxed">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sample Verified Singapore Feedback */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Verified Local Employee Excerpts</span>
          </div>

          <div className="space-y-3">
            {review.sampleFeedback.map((fb, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{fb.title}</span>
                  <span className="text-slate-400">{fb.date}</span>
                </div>
                <div className="text-[11px] text-blue-700 font-medium">
                  {fb.authorRole}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{fb.content}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
