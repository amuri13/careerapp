import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Database,
  GraduationCap,
  TrendingUp,
  Award,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { CareerOption, StudentProfile } from '../types';
import { requestAiCareerAnalysis } from '../services/api';

interface ExplainModalProps {
  career: CareerOption;
  profile?: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({
  career,
  profile,
  isOpen,
  onClose,
}) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [liveAiResult, setLiveAiResult] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<string | null>(null);

  if (!isOpen) return null;

  const { evidenceRationale } = career;

  const handleRunAiDeepAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const res = await requestAiCareerAnalysis(
        profile,
        career.title,
        `Deep dive explanation for ${career.title} market demand and skills suitability in Singapore`
      );
      setLiveAiResult(res.analysis);
      setAiSource(res.source);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Career Evidence & Recommendation Rationale
                </h3>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Evidence-Grounded LMI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Transparent verification of why{' '}
                <strong className="text-slate-800">{career.title}</strong> is recommended in Singapore
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Summary Banner */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                Overall Alignment Score
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold text-blue-700">
                  {career.matchScore}%
                </span>
                <span className="text-xs text-blue-900 font-medium">
                  High Market & Skills Suitability
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Derived from Singapore SSEC degree matching, MOM vacancy ratios, and verified candidate coursework.
              </p>
            </div>

            <button
              onClick={handleRunAiDeepAnalysis}
              disabled={isAiLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 shrink-0"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing LMI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI for Custom Evaluation</span>
                </>
              )}
            </button>
          </div>

          {/* Live AI Analysis Container (if triggered) */}
          {liveAiResult && (
            <div className="bg-slate-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  AI Deep Labour Market Intelligence Output
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {aiSource}
                </span>
              </div>
              <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans bg-white p-3.5 rounded-lg border border-slate-200">
                {liveAiResult}
              </div>
            </div>
          )}

          {/* 1. Profile Evidence */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">
                1. Candidate Profile Evidence
              </h4>
            </div>
            <ul className="space-y-2">
              {evidenceRationale.profileEvidence.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Labour-Market Evidence */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">
                2. Singapore Labour-Market Evidence (MOM MRSD)
              </h4>
            </div>
            <ul className="space-y-2">
              {evidenceRationale.labourMarketEvidence.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Skills Evidence */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-bold text-slate-900">
                3. Skills Alignment & Transferability
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-1.5">
                  Direct Verified Skills ({evidenceRationale.skillsEvidence.matched.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {evidenceRationale.skillsEvidence.matched.map((sk) => (
                    <span key={sk} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-3">
                <span className="text-[11px] font-bold text-blue-800 uppercase block mb-1.5">
                  Transferable Strengths ({evidenceRationale.skillsEvidence.transferable.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {evidenceRationale.skillsEvidence.transferable.map((sk) => (
                    <span key={sk} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-rose-50/60 border border-rose-200 rounded-lg p-3">
                <span className="text-[11px] font-bold text-rose-800 uppercase block mb-1.5">
                  Priority Skills Gaps ({evidenceRationale.skillsEvidence.gapSkills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {evidenceRationale.skillsEvidence.gapSkills.map((sk) => (
                    <span key={sk} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Education Alignment */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  4. Academic & Qualification Taxonomy Alignment
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                {evidenceRationale.educationAlignment.degreeRelevance}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {evidenceRationale.educationAlignment.rationale}
            </p>
            {evidenceRationale.educationAlignment.ssecCode && (
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                Classification Code: {evidenceRationale.educationAlignment.ssecCode}
              </p>
            )}
          </div>

          {/* 5. Data Sources & Dates */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-slate-600" />
              <h4 className="text-sm font-bold text-slate-900">
                5. Data Sources & Citation Dates
              </h4>
            </div>
            <div className="space-y-1.5">
              {evidenceRationale.dataSources.map((ds, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-900">{ds.name}</span>
                    <span className="text-slate-500"> — {ds.publication} ({ds.date})</span>
                  </div>
                  <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                    {ds.geography}
                    {ds.url && <ExternalLink className="w-3 h-3" />}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Uncertainty & Missing Information */}
          <div className="border border-amber-200 bg-amber-50/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <h4 className="text-sm font-bold text-amber-900">
                6. Identified Uncertainties & Missing Information
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-800">
              {evidenceRationale.uncertaintyOrMissingInfo.map((u, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Complies with Singapore Public Sector Data and Skills Governance Standards
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Close Rationale
          </button>
        </div>
      </div>
    </div>
  );
};
