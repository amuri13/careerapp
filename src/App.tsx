/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, ScreenId } from './components/Navbar';
import { MarketInsightsScreen } from './components/screens/MarketInsightsScreen';
import { NavigatorScreen } from './components/screens/NavigatorScreen';
import { DeepDiveScreen } from './components/screens/DeepDiveScreen';
import { PathwaysScreen } from './components/screens/PathwaysScreen';
import { JobExplorerScreen } from './components/screens/JobExplorerScreen';
import { EmployeeReviewsScreen } from './components/screens/EmployeeReviewsScreen';
import { ActionPlanScreen } from './components/screens/ActionPlanScreen';
import { McpHubScreen } from './components/screens/McpHubScreen';
import { CAREER_OPTIONS_DB } from './data/singaporeLmiData';
import { CareerOption } from './types';
import { Compass, ExternalLink, ShieldCheck, Search } from 'lucide-react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('job-explorer');
  const [selectedCareer, setSelectedCareer] = useState<CareerOption>(CAREER_OPTIONS_DB[0]);
  const [targetReviewCompany, setTargetReviewCompany] = useState<string | undefined>(undefined);

  const handleSelectCareer = (career: CareerOption) => {
    setSelectedCareer(career);
  };

  const handleNavigateToDeepDive = (career: CareerOption) => {
    setSelectedCareer(career);
    setActiveScreen('deep-dive');
  };

  const handleNavigateToPathways = (careerOrTitle?: CareerOption | string) => {
    if (typeof careerOrTitle === 'object') {
      setSelectedCareer(careerOrTitle);
    } else if (typeof careerOrTitle === 'string') {
      const found = CAREER_OPTIONS_DB.find(
        (c) =>
          c.title.toLowerCase().includes(careerOrTitle.toLowerCase()) ||
          careerOrTitle.toLowerCase().includes(c.title.toLowerCase())
      );
      if (found) {
        setSelectedCareer(found);
      }
    }
    setActiveScreen('pathways');
  };

  const handleNavigateToReviews = (companyName?: string) => {
    if (companyName) {
      setTargetReviewCompany(companyName);
    }
    setActiveScreen('reviews');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Navigation Header */}
      <Navbar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeScreen === 'job-explorer' && (
          <JobExplorerScreen
            onNavigateToReviews={handleNavigateToReviews}
            onNavigateToPathways={handleNavigateToPathways}
          />
        )}

        {activeScreen === 'navigator' && (
          <NavigatorScreen
            onSelectCareer={handleSelectCareer}
            onNavigateToDeepDive={handleNavigateToDeepDive}
            onNavigateToPathways={handleNavigateToPathways}
            onNavigateToJobExplorer={() => setActiveScreen('job-explorer')}
          />
        )}

        {activeScreen === 'market-insights' && (
          <MarketInsightsScreen
            onNavigateToNavigator={() => setActiveScreen('navigator')}
          />
        )}

        {activeScreen === 'deep-dive' && (
          <DeepDiveScreen
            career={selectedCareer}
            onBackToNavigator={() => setActiveScreen('navigator')}
            onNavigateToPathways={handleNavigateToPathways}
            onNavigateToJobExplorer={() => setActiveScreen('job-explorer')}
            onNavigateToReviews={handleNavigateToReviews}
          />
        )}

        {activeScreen === 'pathways' && (
          <PathwaysScreen
            career={selectedCareer}
            onNavigateToActionPlan={() => setActiveScreen('action-plan')}
            onNavigateToJobs={() => setActiveScreen('job-explorer')}
          />
        )}

        {activeScreen === 'reviews' && (
          <EmployeeReviewsScreen
            initialCompany={targetReviewCompany}
            onNavigateToJobs={() => setActiveScreen('job-explorer')}
          />
        )}

        {activeScreen === 'action-plan' && (
          <ActionPlanScreen
            selectedCareer={selectedCareer}
            onNavigateToJobs={() => setActiveScreen('job-explorer')}
          />
        )}

        {activeScreen === 'mcp-hub' && <McpHubScreen />}
      </main>

      {/* Trust & Evidence Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-600">
            {/* Col 1 */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Search className="w-4 h-4 text-blue-600" />
                <span>SG CareerNavigator</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-semibold">
                  JobDataLake MCP Powered
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-lg">
                Direct job title and skills search engine grounded in real-time JobDataLake MCP data feeds (https://mcp.jobdatalake.com), official Singapore MOM MRSD salary percentiles, and SkillsFuture Singapore competency frameworks.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Real-Time Hourly Ingestion • 25,000+ Companies • Vector Semantic Matching</span>
              </div>
            </div>

            {/* Col 2: Taxonomies */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 uppercase tracking-wider block">
                Official Taxonomies
              </span>
              <ul className="space-y-1 text-slate-500">
                <li>SSOC 2020 (Occupations)</li>
                <li>SSIC 2020 (Industries)</li>
                <li>SkillsFuture SG Competencies</li>
                <li>MOM Labour Market Statistics</li>
                <li>SSEC Educational Classifications</li>
              </ul>
            </div>

            {/* Col 3: MCP & Standards */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 uppercase tracking-wider block">
                JobDataLake MCP Tools
              </span>
              <ul className="space-y-1 text-slate-500 font-mono text-[11px]">
                <li>search_jobs()</li>
                <li>get_job()</li>
                <li>get_company()</li>
                <li>get_filter_options()</li>
                <li>find_similar_jobs()</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>© 2026 SG CareerNavigator • Powered by https://mcp.jobdatalake.com</p>
            <div className="flex items-center gap-4">
              <a
                href="https://mcp.jobdatalake.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 flex items-center gap-1 font-medium text-blue-700"
              >
                mcp.jobdatalake.com <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://stats.mom.gov.sg"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 flex items-center gap-1"
              >
                MOM MRSD Portal <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.skillsfuture.gov.sg"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 flex items-center gap-1"
              >
                SkillsFuture SG <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
