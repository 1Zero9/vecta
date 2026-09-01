"use client";

import React from "react";
import { 
  Building2, 
  Briefcase, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp,
  Cpu,
  Layers,
  Scale
} from "lucide-react";
import { DomainType } from "@/lib/types";

interface MetricCardsProps {
  totalCompanies: number;
  totalJobs: number;
  aiJobsCount: number;
  secJobsCount: number;
  govJobsCount: number;
  itJobsCount: number;
  pipelineCount: number;
  activeDomainFilter: DomainType | "ALL";
  setDomainFilter: (domain: DomainType | "ALL") => void;
  setActiveTab: (tab: "jobs" | "radar" | "recruiter" | "pipeline" | "governance") => void;
  openGovernance: () => void;
}

export function MetricCards({
  totalCompanies,
  totalJobs,
  aiJobsCount,
  secJobsCount,
  govJobsCount,
  itJobsCount,
  pipelineCount,
  activeDomainFilter,
  setDomainFilter,
  setActiveTab,
  openGovernance,
}: MetricCardsProps) {
  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 shadow-lg space-y-4">
      
      {/* Top Value Proposition & Live Telemetry Ticker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold uppercase border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Direct ATS Feeds Active
            </span>
            <button
              onClick={openGovernance}
              className="text-slate-400 hover:text-amber-300 text-xs flex items-center gap-1 transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>EU AI Act & GDPR Disclosures</span>
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1.5">
            Recruitment Intelligence & Career Vector Navigator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-0.5">
            Curated vacancies and company intelligence across <span className="text-cyan-300 font-semibold">AI & Machine Learning</span>, <span className="text-rose-300 font-semibold">Cybersecurity</span>, <span className="text-amber-300 font-semibold">Governance & GRC</span>, and <span className="text-indigo-300 font-semibold">IT Infrastructure</span>.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 bg-slate-950/70 p-3 rounded-2xl border border-white/5">
          <div 
            onClick={() => setActiveTab("jobs")}
            className="cursor-pointer text-center px-3 sm:px-4 py-1 hover:bg-slate-900 rounded-xl transition-colors"
          >
            <div className="text-[10px] uppercase font-bold text-slate-400">Direct Jobs</div>
            <div className="text-xl sm:text-2xl font-mono font-black text-emerald-400">{totalJobs}</div>
          </div>

          <div className="w-px h-8 bg-white/10"></div>

          <div 
            onClick={() => setActiveTab("radar")}
            className="cursor-pointer text-center px-3 sm:px-4 py-1 hover:bg-slate-900 rounded-xl transition-colors"
          >
            <div className="text-[10px] uppercase font-bold text-slate-400">Ecosystem Hubs</div>
            <div className="text-xl sm:text-2xl font-mono font-black text-white">{totalCompanies}</div>
          </div>

          <div className="w-px h-8 bg-white/10"></div>

          <div 
            onClick={() => setActiveTab("pipeline")}
            className="cursor-pointer text-center px-3 sm:px-4 py-1 hover:bg-slate-900 rounded-xl transition-colors"
          >
            <div className="text-[10px] uppercase font-bold text-slate-400">In Pipeline</div>
            <div className="text-xl sm:text-2xl font-mono font-black text-indigo-400">{pipelineCount}</div>
          </div>
        </div>
      </div>

      {/* Domain Vector Quick Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Focus Vector:
          </span>

          <button
            onClick={() => setDomainFilter("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeDomainFilter === "ALL"
                ? "bg-white text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            All Disciplines ({totalJobs})
          </button>

          <button
            onClick={() => setDomainFilter("AI")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeDomainFilter === "AI"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "bg-slate-900 text-cyan-400 hover:bg-cyan-950/40 border border-white/5"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI & Machine Learning ({aiJobsCount})</span>
          </button>

          <button
            onClick={() => setDomainFilter("Security")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeDomainFilter === "Security"
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                : "bg-slate-900 text-rose-400 hover:bg-rose-950/40 border border-white/5"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cybersecurity ({secJobsCount})</span>
          </button>

          <button
            onClick={() => setDomainFilter("Governance")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeDomainFilter === "Governance"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-900 text-amber-400 hover:bg-amber-950/40 border border-white/5"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Governance & GRC ({govJobsCount})</span>
          </button>

          <button
            onClick={() => setDomainFilter("IT")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeDomainFilter === "IT"
                ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                : "bg-slate-900 text-indigo-400 hover:bg-indigo-950/40 border border-white/5"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>IT & Cloud ({itJobsCount})</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono hidden md:block">
          Click any role to audit Vector Fit or generate tailored CV
        </div>
      </div>

    </div>
  );
}
