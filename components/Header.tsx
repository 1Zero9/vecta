"use client";

import React from "react";
import { 
  Compass, 
  Briefcase, 
  Users, 
  Kanban, 
  Search, 
  Moon, 
  Sun, 
  Sparkles,
  UserCheck,
  ShieldCheck,
  Cpu,
  Binary
} from "lucide-react";

interface HeaderProps {
  activeTab: "jobs" | "radar" | "recruiter" | "pipeline";
  setActiveTab: (tab: "jobs" | "radar" | "recruiter" | "pipeline") => void;
  isDark: boolean;
  toggleTheme: () => void;
  openCmdPalette: () => void;
  openProfileDrawer: () => void;
  candidateName: string;
  totalLiveJobs: number;
}

export function Header({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  openCmdPalette,
  openProfileDrawer,
  candidateName,
  totalLiveJobs,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 dark:border-white/10 bg-slate-950/85 dark:bg-slate-950/85 backdrop-blur-xl transition-colors">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Telemetry Indicator */}
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab("jobs")}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-tr from-emerald-400 to-cyan-300 text-2xl tracking-tighter">
                    V
                  </span>
                </div>
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-radar-ping"></span>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>VECTA</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Radar v2.4
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Recruitment Intelligence & Career Navigator // <span className="text-cyan-400">AI</span> • <span className="text-rose-400">Security</span> • <span className="text-amber-400">Governance</span> • <span className="text-indigo-400">IT</span>
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-inner">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "jobs"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Direct Jobs</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === "jobs" ? "bg-slate-950/20 text-slate-950 font-bold" : "bg-emerald-500/15 text-emerald-400"}`}>
                {totalLiveJobs}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("radar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "radar"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Company Radar</span>
            </button>

            <button
              onClick={() => setActiveTab("recruiter")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "recruiter"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Recruiter & Market Intel</span>
            </button>

            <button
              onClick={() => setActiveTab("pipeline")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "pipeline"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Career Pipeline</span>
            </button>
          </nav>

          {/* Right Action Tools Cluster */}
          <div className="flex items-center gap-2.5">
            {/* Quick Search / Cmd+K button */}
            <button
              onClick={openCmdPalette}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-medium transition-all shadow-sm group"
              title="Search everything (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline">Search Vecta...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Profile Drawer Trigger */}
            <button
              onClick={openProfileDrawer}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-semibold transition-all shadow-sm"
              title="Edit Candidate Profile & Vector Match Settings"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                {candidateName.charAt(0) || "A"}
              </div>
              <span className="hidden sm:inline">{candidateName.split(" ")[0]}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
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

        {/* Mobile View Switcher */}
        <div className="flex md:hidden items-center justify-between pb-3 pt-1 border-t border-white/5 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === "jobs" ? "bg-emerald-500 text-slate-950" : "text-slate-400 bg-slate-900"
            }`}
          >
            Direct Jobs ({totalLiveJobs})
          </button>
          <button
            onClick={() => setActiveTab("radar")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === "radar" ? "bg-emerald-500 text-slate-950" : "text-slate-400 bg-slate-900"
            }`}
          >
            Radar
          </button>
          <button
            onClick={() => setActiveTab("recruiter")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === "recruiter" ? "bg-emerald-500 text-slate-950" : "text-slate-400 bg-slate-900"
            }`}
          >
            Market Intel
          </button>
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === "pipeline" ? "bg-emerald-500 text-slate-950" : "text-slate-400 bg-slate-900"
            }`}
          >
            Pipeline
          </button>
        </div>

      </div>
    </header>
  );
}
