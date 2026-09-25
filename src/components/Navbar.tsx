import React from 'react';
import {
  Compass,
  TrendingUp,
  Briefcase,
  Layers,
  GitFork,
  MessageSquare,
  CalendarCheck,
  Cpu,
  ChevronDown,
} from 'lucide-react';
import { StudentProfile } from '../types';

export type ScreenId =
  | 'navigator'
  | 'market-insights'
  | 'deep-dive'
  | 'pathways'
  | 'job-explorer'
  | 'reviews'
  | 'action-plan'
  | 'mcp-hub';

interface NavbarProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  currentProfile: StudentProfile;
  allProfiles: StudentProfile[];
  onSelectProfile: (profile: StudentProfile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onSelectScreen,
  currentProfile,
  allProfiles,
  onSelectProfile,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const navItems: { id: ScreenId; label: string; icon: React.ReactNode }[] = [
    { id: 'navigator', label: 'Career Navigator', icon: <Compass className="w-4 h-4" /> },
    { id: 'market-insights', label: 'Labour Insights', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'deep-dive', label: 'Career Deep Dive', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'pathways', label: 'Career Pathways', icon: <GitFork className="w-4 h-4" /> },
    { id: 'job-explorer', label: 'Job Explorer (JobDataLake)', icon: <Layers className="w-4 h-4" /> },
    { id: 'reviews', label: 'Company Dossier', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'action-plan', label: '90-Day Plan', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'mcp-hub', label: 'JobDataLake MCP', icon: <Cpu className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner: Branding, SG Standards & Profile Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm ring-4 ring-blue-50">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  SG CareerNavigator AI
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                  JobDataLake MCP Powered
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Labour Market Intelligence • MOM MRSD • https://mcp.jobdatalake.com
              </p>
            </div>
          </div>

          {/* Right: Active Profile Switcher & Fast Status */}
          <div className="flex items-center gap-3">
            {/* Quick Profile Selector (1-Click, No typing needed) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors"
                title="Switch active student persona"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {currentProfile.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentProfile.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {currentProfile.institution}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Select Verified Student Profile
                      </p>
                    </div>
                    {allProfiles.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          onSelectProfile(p);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-blue-50 transition-colors ${
                          p.id === currentProfile.id ? 'bg-blue-50/60 font-semibold' : ''
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm text-slate-900 leading-tight truncate font-medium">
                            {p.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {p.fieldOfStudy} ({p.institution})
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quick Status Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>mcp.jobdatalake.com Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="bg-slate-50/80 border-t border-slate-200/80 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-1.5" aria-label="Tabs">
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectScreen(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
