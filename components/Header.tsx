"use client";

import React from "react";
import { UserAccount } from "@/lib/types";
import { 
  Briefcase, 
  Compass, 
  Users, 
  Kanban, 
  Search, 
  Moon, 
  Sun, 
  ShieldCheck, 
  UserCheck, 
  Scale,
  Sparkles,
  ChevronDown
} from "lucide-react";

interface HeaderProps {
  activeTab: "jobs" | "radar" | "recruiter" | "pipeline" | "governance";
  setActiveTab: (tab: "jobs" | "radar" | "recruiter" | "pipeline" | "governance") => void;
  currentUser: UserAccount;
  isDark: boolean;
  toggleTheme: () => void;
  openCmdPalette: () => void;
  openUserManagement: () => void;
  openGovernance: () => void;
  totalLiveJobs: number;
}

export function Header({
  activeTab,
  setActiveTab,
  currentUser,
  isDark,
  toggleTheme,
  openCmdPalette,
  openUserManagement,
  openGovernance,
  totalLiveJobs,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 dark:border-white/10 bg-slate-950/90 backdrop-blur-xl transition-all">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab("jobs")}>
            <div className="relative group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-tr from-emerald-400 to-cyan-300 text-xl tracking-tighter">
                    V
                  </span>
                </div>
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-radar-ping"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  VECTA
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                  v2.5
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Recruitment Intelligence // <span className="text-cyan-400">AI</span> • <span className="text-rose-400">Security</span> • <span className="text-amber-400">Governance</span> • <span className="text-indigo-400">IT</span>
              </p>
            </div>
          </div>

          {/* Clean Primary Navigation Tabs */}
          <nav className="hidden lg:flex items-center p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-inner">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "jobs"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Direct Jobs</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === "jobs" ? "bg-slate-950/20 text-slate-950 font-bold" : "bg-emerald-500/20 text-emerald-400 font-bold"}`}>
                {totalLiveJobs}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("radar")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "radar"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Company Radar</span>
            </button>

            <button
              onClick={() => setActiveTab("recruiter")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "recruiter"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Market Intel</span>
            </button>

            <button
              onClick={() => setActiveTab("pipeline")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "pipeline"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Pipeline</span>
            </button>

            <button
              onClick={openGovernance}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-all"
              title="View EU AI Act, GDPR, ISO 42001 & Legal Disclaimers"
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Governance</span>
            </button>
          </nav>

          {/* Right Action Tools & User Management */}
          <div className="flex items-center gap-2.5">
            
            {/* Quick Search Cmd+K */}
            <button
              onClick={openCmdPalette}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-medium transition-all shadow-sm group"
              title="Search everything (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden xl:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Active Account Pill & Switcher */}
            <button
              onClick={openUserManagement}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-semibold transition-all shadow-sm group"
              title="Switch user account or edit persona"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-sm">
                {currentUser.avatar}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-white font-bold leading-tight flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  {currentUser.isDemo ? "Default Demo" : "Active"}
                </div>
              </div>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:scale-110 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300 hover:scale-110 transition-transform" />
              )}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden items-center justify-between pb-3 pt-1 border-t border-white/5 overflow-x-auto gap-2 text-xs">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap ${
              activeTab === "jobs" ? "bg-emerald-500 text-slate-950" : "text-slate-400 bg-slate-900"
            }`}
          >
            Direct Jobs ({totalLiveJobs})
          </button>
          <button
            onClick={() => setActiveTab("radar")}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap ${
              activeTab === "radar" ? "bg-emerald-500 text-slate-950" : "text-slate-400 bg-slate-900"
            }`}
          >
            Radar
          </button>
          <button
            onClick={() => setActiveTab("recruiter")}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap ${
              activeTab === "recruiter" ? "bg-emerald-500 text-slate-950" : "text-slate-400 bg-slate-900"
            }`}
          >
            Market Intel
          </button>
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap ${
              activeTab === "pipeline" ? "bg-emerald-500 text-slate-950" : "text-slate-400 bg-slate-900"
            }`}
          >
            Pipeline
          </button>
          <button
            onClick={openGovernance}
            className="px-3 py-1.5 rounded-lg font-bold whitespace-nowrap text-amber-400 bg-slate-900 flex items-center gap-1"
          >
            <Scale className="w-3 h-3" />
            <span>Governance</span>
          </button>
        </div>

      </div>
    </header>
  );
}
