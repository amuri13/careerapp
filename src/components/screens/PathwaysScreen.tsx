import React, { useState } from 'react';
import {
  GitFork,
  Key,
  Briefcase,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { CareerOption, StudentProfile, CareerPathwayNode } from '../../types';
import { CAREER_PATHWAYS_DATA } from '../../data/singaporeLmiData';

interface PathwaysScreenProps {
  career: CareerOption;
  profile: StudentProfile;
  onNavigateToActionPlan: () => void;
  onNavigateToJobs?: () => void;
}

export const PathwaysScreen: React.FC<PathwaysScreenProps> = ({
  career,
  onNavigateToActionPlan,
}) => {
  const pathwayNodes: CareerPathwayNode[] =
    CAREER_PATHWAYS_DATA[career.id] || CAREER_PATHWAYS_DATA['career-cloud-ai-engineer'];

  const [activeStageIndex, setActiveStageIndex] = useState(1);

  const activeNode = pathwayNodes[activeStageIndex] || pathwayNodes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <GitFork className="w-3.5 h-3.5" />
              <span>Multi-Stage Progression & Skill Unlock Keys</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Career Trajectory & Unlocks: {career.title}
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Visualize how your current profile bridges into entry roles, mid-level specialization, strategic leadership, or lateral pivots into technical product management in the Singapore economy.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateToActionPlan}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <span>Build 90-Day Execution Plan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Horizontal Pathway Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[750px] relative">
          {/* Background connecting line */}
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0" />

          {pathwayNodes.map((node, idx) => {
            const isActive = idx === activeStageIndex;
            const isCompleted = idx < activeStageIndex;

            return (
              <div
                key={idx}
                onClick={() => setActiveStageIndex(idx)}
                className="relative z-10 flex flex-col items-center text-center cursor-pointer group"
                style={{ width: `${100 / pathwayNodes.length}%` }}
              >
                {/* Node Circle */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                    isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-700 border-2 border-slate-300 group-hover:border-blue-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                </div>

                {/* Stage Title */}
                <div className="mt-3 text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {node.stage}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {node.salaryRangeSGD}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Deep Dive Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Node Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Stage: {activeNode.stage}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              {activeNode.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
              <span>Experience: <strong className="text-slate-800">{activeNode.typicalYearsExperience}</strong></span>
              <span>•</span>
              <span className="text-blue-700 font-bold">
                Compensation: {activeNode.salaryRangeSGD} / mo
              </span>
              {activeNode.ssocCode && (
                <>
                  <span>•</span>
                  <span className="font-mono text-slate-600">{activeNode.ssocCode}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Details: Responsibilities & Skill Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Key Responsibilities at this Stage */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Core Responsibilities & Deliverables</span>
            </div>
            <ul className="space-y-2">
              {activeNode.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3">
              <span className="text-xs font-bold text-slate-700 block mb-1">
                Typical Job Titles in Singapore:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeNode.sampleRoles.map((role) => (
                  <span
                    key={role}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Requirements & Unlocks */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Skills Required for this Stage</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeNode.skillsRequired.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Skill Unlock Keys */}
            {activeNode.skillsToUnlockNextStage && activeNode.skillsToUnlockNextStage.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Key className="w-4 h-4 text-amber-600" />
                  <span>Skill Unlock Keys (To Reach Next Band):</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Acquiring these specific competencies unlocks the next compensation band and leadership tier in the Singapore market:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeNode.skillsToUnlockNextStage.map((keySkill) => (
                    <span
                      key={keySkill}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300"
                    >
                      🔑 {keySkill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
