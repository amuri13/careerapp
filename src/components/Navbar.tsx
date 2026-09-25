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
  Search,
  ExternalLink,
} from 'lucide-react';

export type ScreenId =
  | 'job-explorer'
  | 'navigator'
  | 'deep-dive'
  | 'pathways'
  | 'market-insights'
  | 'reviews'
  | 'action-plan'
  | 'mcp-hub';

interface NavbarProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onSelectScreen,
}) => {
  const navItems: { id: ScreenId; label: string; icon: React.ReactNode }[] = [
    { id: 'job-explorer', label: 'Find Jobs & Skills', icon: <Search className="w-4 h-4" /> },
    { id: 'navigator', label: 'Career Pathways & Roles', icon: <Compass className="w-4 h-4" /> },
    { id: 'market-insights', label: 'Labour Insights (MOM LMI)', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'reviews', label: 'Company Dossiers', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'action-plan', label: '90-Day Career Plan', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'mcp-hub', label: 'JobDataLake MCP Hub', icon: <Cpu className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner: Branding & Live MCP Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Title */}
          <div
            onClick={() => onSelectScreen('job-explorer')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm ring-4 ring-blue-50 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  SG CareerNavigator
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                  JobDataLake MCP
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Live Job & Skills Search • MOM MRSD • https://mcp.jobdatalake.com
              </p>
            </div>
          </div>

          {/* Right: Live Connection Indicator & Quick Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://mcp.jobdatalake.com"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              <span>mcp.jobdatalake.com</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live MCP Feed Online</span>
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
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
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
