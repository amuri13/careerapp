import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Download,
  BookOpen,
  Code,
  Users,
  Send,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { ActionPlanItem, CareerOption } from '../../types';
import { DEFAULT_90_DAY_ACTION_PLAN } from '../../data/singaporeLmiData';

interface ActionPlanScreenProps {
  selectedCareer?: CareerOption;
  onNavigateToJobs: () => void;
}

export const ActionPlanScreen: React.FC<ActionPlanScreenProps> = ({
  selectedCareer,
  onNavigateToJobs,
}) => {
  const planKey = `sg_career_plan_${selectedCareer?.id || 'general'}`;

  const [planItems, setPlanItems] = useState<ActionPlanItem[]>(() => {
    const saved = localStorage.getItem(planKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return DEFAULT_90_DAY_ACTION_PLAN;
  });

  const [activePhaseFilter, setActivePhaseFilter] = useState<string>('all');

  // Save changes
  const toggleItemCompletion = (id: string) => {
    const updated = planItems.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setPlanItems(updated);
    localStorage.setItem(planKey, JSON.stringify(updated));
  };

  const completedCount = planItems.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / planItems.length) * 100);

  const filteredItems =
    activePhaseFilter === 'all'
      ? planItems
      : planItems.filter((i) => i.phase.toLowerCase().includes(activePhaseFilter.toLowerCase()));

  const handleExportMarkdown = () => {
    const lines = [
      `# 90-Day Career Readiness & Skill Acquisition Plan`,
      `Target Role: ${selectedCareer?.title || 'Cloud & AI Solutions Engineer'} (Singapore)`,
      `Generated: ${new Date().toLocaleDateString()}`,
      `Progress: ${completedCount}/${planItems.length} (${progressPercent}% completed)`,
      '',
      ...planItems.map(
        (item) =>
          `- [${item.completed ? 'x' : ' '}] **Week ${item.week}**: ${item.title} (${item.category})\n  *Resource:* ${item.providerOrResource} | *Est:* ${item.estimatedHours} hrs\n  *Notes:* ${item.description}\n`
      ),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = url;
    element.download = `${(selectedCareer?.title || 'Career').replace(/\s+/g, '_')}_90_Day_Plan.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Certification':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'Portfolio Project':
        return <Code className="w-4 h-4 text-emerald-600" />;
      case 'Networking':
        return <Users className="w-4 h-4 text-indigo-600" />;
      case 'Application':
        return <Send className="w-4 h-4 text-purple-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Singapore SkillsFuture & MOM Aligned</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              90-Day Career Readiness Plan: {selectedCareer?.title || 'Cloud Solutions Engineer'}
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Step-by-step weekly milestones engineered to bridge candidate skill gaps, obtain employer-recognized Singapore credentials, build production portfolio artifacts, and secure interviews via JobDataLake openings.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Markdown</span>
            </button>
            <button
              onClick={onNavigateToJobs}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <span>Explore Live Vacancies</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              90-Day Execution Trajectory
            </h2>
            <p className="text-xs text-slate-500">
              {completedCount} of {planItems.length} milestones accomplished
            </p>
          </div>
          <span className="text-2xl font-black text-blue-700">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
          <div
            className="bg-blue-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Phase Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Phase:</span>
        </div>
        {[
          { id: 'all', label: 'All 90 Days' },
          { id: 'Phase 1', label: 'Days 1-30: Foundation' },
          { id: 'Phase 2', label: 'Days 31-60: Portfolio' },
          { id: 'Phase 3', label: 'Days 61-90: Pipeline' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePhaseFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activePhaseFilter === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Milestone Checklists */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItemCompletion(item.id)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              item.completed
                ? 'bg-emerald-50/40 border-emerald-200/80 shadow-2xs'
                : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                  item.completed
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-slate-300 text-transparent'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Week {item.week}
                  </span>
                  <span className="text-xs text-blue-700 font-semibold">
                    {item.phase}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    {getCategoryIcon(item.category)}
                    <span>{item.category}</span>
                  </span>
                </div>

                <h3
                  className={`text-sm font-bold transition-all ${
                    item.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                  }`}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-xs shrink-0 pl-10 sm:pl-0">
              <span className="font-semibold text-slate-800 text-right">
                {item.providerOrResource}
              </span>
              <span className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5">
                <Clock className="w-3 h-3" />
                <span>~{item.estimatedHours} hrs</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
