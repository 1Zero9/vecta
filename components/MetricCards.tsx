"use client";

import React from "react";
import { 
  Building2, 
  Briefcase, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp,
  Cpu
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
  setActiveTab: (tab: "jobs" | "radar" | "recruiter" | "pipeline") => void;
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
}: MetricCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      
      {/* 1. Total Companies */}
      <div
        onClick={() => setActiveTab("radar")}
        className="cursor-pointer select-none rounded-2xl p-4 sm:p-5 bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-emerald-500/40 transition-all shadow-sm group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>Tech Ecosystem</span>
          <Building2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
        </div>
        <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
          {totalCompanies}
        </div>
        <div className="mt-1 text-[11px] text-slate-400 truncate">
          Scaleups & Hubs
        </div>
      </div>

      {/* 2. Total Live Jobs */}
      <div
        onClick={() => {
          setDomainFilter("ALL");
          setActiveTab("jobs");
        }}
        className={`cursor-pointer select-none rounded-2xl p-4 sm:p-5 transition-all shadow-sm group flex flex-col justify-between ${
          activeDomainFilter === "ALL"
            ? "bg-emerald-950/40 border border-emerald-500/60 ring-1 ring-emerald-500/40"
            : "bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-emerald-500/30"
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
          <span>Direct ATS Roles</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
          {totalJobs}
        </div>
        <div className="mt-1 text-[11px] text-emerald-300/80 truncate">
          Verified Vacancies
        </div>
      </div>

      {/* 3. AI & ML Vector */}
      <div
        onClick={() => {
          setDomainFilter("AI");
          setActiveTab("jobs");
        }}
        className={`cursor-pointer select-none rounded-2xl p-4 sm:p-5 transition-all shadow-sm group flex flex-col justify-between ${
          activeDomainFilter === "AI"
            ? "bg-cyan-950/50 border border-cyan-500/60 ring-1 ring-cyan-500/40"
            : "bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-cyan-500/30"
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold text-cyan-400">
          <span>AI / GenAI</span>
          <Sparkles className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-cyan-300 tracking-tight">
          {aiJobsCount}
        </div>
        <div className="mt-1 text-[11px] text-cyan-300/80 truncate">
          LLM & MLOps
        </div>
      </div>

      {/* 4. Security Vector */}
      <div
        onClick={() => {
          setDomainFilter("Security");
          setActiveTab("jobs");
        }}
        className={`cursor-pointer select-none rounded-2xl p-4 sm:p-5 transition-all shadow-sm group flex flex-col justify-between ${
          activeDomainFilter === "Security"
            ? "bg-rose-950/50 border border-rose-500/60 ring-1 ring-rose-500/40"
            : "bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-rose-500/30"
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold text-rose-400">
          <span>Cybersecurity</span>
          <ShieldCheck className="w-4 h-4 text-rose-400" />
        </div>
        <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-rose-300 tracking-tight">
          {secJobsCount}
        </div>
        <div className="mt-1 text-[11px] text-rose-300/80 truncate">
          CloudSec & AppSec
        </div>
      </div>

      {/* 5. Governance Vector */}
      <div
        onClick={() => {
          setDomainFilter("Governance");
          setActiveTab("jobs");
        }}
        className={`cursor-pointer select-none rounded-2xl p-4 sm:p-5 transition-all shadow-sm group flex flex-col justify-between ${
          activeDomainFilter === "Governance"
            ? "bg-amber-950/50 border border-amber-500/60 ring-1 ring-amber-500/40"
            : "bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-amber-500/30"
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
          <span>Governance & GRC</span>
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-amber-300 tracking-tight">
          {govJobsCount}
        </div>
        <div className="mt-1 text-[11px] text-amber-300/80 truncate">
          EU AI Act & NIS2
        </div>
      </div>

      {/* 6. Career Pipeline */}
      <div
        onClick={() => setActiveTab("pipeline")}
        className="cursor-pointer select-none rounded-2xl p-4 sm:p-5 bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-indigo-500/40 transition-all shadow-sm group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-xs font-semibold text-indigo-400">
          <span>Active Pipeline</span>
          <TrendingUp className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-indigo-300 tracking-tight">
          {pipelineCount}
        </div>
        <div className="mt-1 text-[11px] text-indigo-300/80 truncate">
          Tracked Applications
        </div>
      </div>

    </div>
  );
}
