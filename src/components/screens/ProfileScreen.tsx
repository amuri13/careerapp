import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Sparkles,
  MapPin,
  DollarSign,
  CheckCircle2,
  Building2,
  Heart,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { StudentProfile } from '../../types';

interface ProfileScreenProps {
  currentProfile: StudentProfile;
  allProfiles: StudentProfile[];
  onSelectProfile: (profile: StudentProfile) => void;
  onNavigateToNavigator: () => void;
  onNavigateToMarketInsights: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentProfile,
  allProfiles,
  onSelectProfile,
  onNavigateToNavigator,
  onNavigateToMarketInsights,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Automated Intelligence • Zero Manual Form Filling Required</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Verified Student Profile & Labour Market Baseline
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Academic credentials, technical competencies, verified internships, and Singapore salary benchmarks are automatically loaded and mapped. Select any student archetype below to explore personalized evidence-backed career pathways.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onNavigateToNavigator}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Career Options</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1-Click Persona Selection Bar (No User Typing Required) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
          Select Student Archetype (1-Click Automated Switch):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allProfiles.map((p) => {
            const isSelected = p.id === currentProfile.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProfile(p)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-900">{p.name}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </div>
                <div className="text-xs text-blue-700 font-semibold truncate">
                  {p.educationLevel}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {p.institution}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header Profile Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-sm">
              {currentProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {currentProfile.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Credentials</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {currentProfile.educationLevel} in {currentProfile.fieldOfStudy} ({currentProfile.institution}) • Graduating {currentProfile.graduationYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Target Monthly Salary
              </span>
              <span className="text-lg font-black text-blue-700">
                SGD ${currentProfile.targetMonthlySalarySGD.toLocaleString()} / mo
              </span>
            </div>
          </div>
        </div>

        {/* Narrative Bio */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900 block mb-1">Professional Profile Summary:</strong>
          {currentProfile.summary}
        </div>

        {/* 2-Column Grid: Skills & Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Technical Competencies */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Verified Technical Skills ({currentProfile.skills.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentProfile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 block mb-1.5">
                Core Generic & Leadership Competencies:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentProfile.softSkills.map((soft) => (
                  <span
                    key={soft}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700"
                  >
                    {soft}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Past Experience & Internships */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Internship & Project History</span>
            </div>
            <div className="space-y-3">
              {currentProfile.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{exp.title}</span>
                    <span className="text-blue-700 font-semibold">{exp.duration}</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-600">
                    {exp.organization}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interests & Preferred Locations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Career Interests</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {currentProfile.interests.map((int) => (
                <span
                  key={int}
                  className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[11px]"
                >
                  {int}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-2">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>Preferred Locations (Singapore)</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {currentProfile.preferredLocations.map((loc) => (
                <span
                  key={loc}
                  className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px]"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span>Target Sectors</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {currentProfile.preferredIndustries.map((ind) => (
                <span
                  key={ind}
                  className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px]"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Profile automatically synchronized with MOM MRSD taxonomies and JobDataLake MCP postings.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToMarketInsights}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              View Labour Market Insights
            </button>
            <button
              onClick={onNavigateToNavigator}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Explore Recommended Careers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
