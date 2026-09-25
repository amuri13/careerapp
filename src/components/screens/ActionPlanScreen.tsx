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
import { ActionPlanItem, StudentProfile, CareerOption } from '../../types';
import { DEFAULT_90_DAY_ACTION_PLAN } from '../../data/singaporeLmiData';

interface ActionPlanScreenProps {
  profile: StudentProfile;
  selectedCareer?: CareerOption;
  onNavigateToJobs: () => void;
}

export const ActionPlanScreen: React.FC<ActionPlanScreenProps> = ({
  profile,
  selectedCareer,
  onNavigateToJobs,
}) => {
  const [planItems, setPlanItems] = useState<ActionPlanItem[]>(() => {
    const saved = localStorage.getItem(`sg_career_plan_${profile.id}`);
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
    localStorage.setItem(`sg_career_plan_${profile.id}`, JSON.stringify(updated));
  };

  const completedCount = planItems.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / planItems.length) * 100);

  const filteredItems =
    activePhaseFilter === 'all'
      ? planItems
      : planItems.filter((i) => i.phase.toLowerCase().includes(activePhaseFilter.toLowerCase()));

  const handleExportMarkdown = () => {
    const lines = [
      `# 90-Day Career Readiness Plan for ${profile.name}`,
      `Target Role: ${selectedCareer?.title || 'Cloud & AI Solutions Engineer'} (Singapore)`,
      `Generated: ${new Date().toLocaleDateString()}`,
      `Progress: ${completedCount}/${planItems.length} (${progressPercent}% completed)`,
      '',
      ...planItems.map(
        (item) =>
          `- [${item.completed ? 'x' : ' '}] **Week ${item.week}**: ${item.title} (${item.category})\n  *Resource:* ${item.providerOrResource} | *Est:* ${item.estimatedHours} hrs\n  *Notes:* ${item.description}\n`
      ),
    ];

    const element = document.createElement('a');
    const file = new Blob([lines.join('\n')], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${profile.name.replace(/\s+/g, '_')}_90_Day_Plan.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Learning / Certification':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'Portfolio Project':
        return <Code className="w-4 h-4 text-purple-600" />;
      case 'Industry & Networking':
        return <Users className="w-4 h-4 text-emerald-600" />;
      case 'Application Strategy':
        return <Send className="w-4 h-4 text-indigo-600" />;
      default:
        return <CalendarCheck className="w-4 h-4 text-slate-600" />;
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
              <span>Actionable Bridge to Singapore Employment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              90-Day Career Execution Plan
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Convert your identified skills gaps into practical learning milestones, tangible portfolio artifacts, and high-conversion job applications tailored for {selectedCareer?.title || 'your target career'}.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export as Markdown</span>
            </button>
            <button
              onClick={onNavigateToJobs}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <span>Explore SG Jobs</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Overall Roadmap Completion: {completedCount} of {planItems.length} actions complete
            </span>
            <span className="font-extrabold text-blue-700 text-sm">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter Phase:</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All 90 Days' },
              { id: 'foundation', label: 'Days 1-30: Foundation' },
              { id: 'projects', label: 'Days 31-60: Projects' },
              { id: 'applications', label: 'Days 61-90: Applications' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePhaseFilter(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activePhaseFilter === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-500">
          {filteredItems.length} milestones
        </span>
      </div>

      {/* Plan Items List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItemCompletion(item.id)}
            className={`bg-white rounded-2xl border p-5 shadow-xs transition-all cursor-pointer flex items-start gap-4 ${
              item.completed
                ? 'border-emerald-300 bg-emerald-50/20'
                : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            {/* Checkbox */}
            <div className="mt-1 shrink-0">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                  item.completed
                    ? 'bg-emerald-600 text-white'
                    : 'border-2 border-slate-300 hover:border-blue-500'
                }`}
              >
                {item.completed && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    Week {item.week}
                  </span>
                  <h3
                    className={`text-sm font-bold ${
                      item.completed ? 'text-slate-500 line-through' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3" /> {item.estimatedHours} hrs
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.priority === 'Essential'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  {getCategoryIcon(item.category)}
                  {item.category}
                </span>
                <span>•</span>
                <span className="text-blue-700 font-medium">
                  Resource: {item.providerOrResource}
                </span>
                <span>•</span>
                <span className="text-slate-400">{item.phase.split(':')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
