"use client";

import React from "react";
import { Sparkles, ShieldCheck, CheckCircle2, Cpu, Scale, ArrowUpRight } from "lucide-react";
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
  const domains = [
    { id: "AI", label: "AI & ML", count: aiJobsCount, icon: Sparkles, tone: "text-sky-700 bg-sky-50 border-sky-200" },
    { id: "Security", label: "Security", count: secJobsCount, icon: ShieldCheck, tone: "text-rose-700 bg-rose-50 border-rose-200" },
    { id: "Governance", label: "Governance", count: govJobsCount, icon: CheckCircle2, tone: "text-amber-700 bg-amber-50 border-amber-200" },
    { id: "IT", label: "IT & Cloud", count: itJobsCount, icon: Cpu, tone: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  ] as const;

  return (
    <section className="glass-panel overflow-hidden rounded-2xl">
      <div className="grid gap-6 px-5 py-6 sm:px-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Curated opportunity workspace
            </span>
            <button onClick={openGovernance} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800">
              <Scale className="h-3.5 w-3.5" />
              How Vecta uses your data
            </button>
          </div>
          <h1 className="max-w-3xl text-2xl font-semibold tracking-[-0.035em] text-slate-900 sm:text-3xl">
            Find work that fits where you’re heading.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Compare specialist roles, understand your fit, and keep every application moving in one calm workspace.
          </p>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-xl border border-slate-200 bg-[#fafbf9] p-1">
          {[
            { label: "Roles", value: totalJobs, tab: "jobs" as const },
            { label: "Companies", value: totalCompanies, tab: "radar" as const },
            { label: "Pipeline", value: pipelineCount, tab: "pipeline" as const },
          ].map((metric) => (
            <button key={metric.label} onClick={() => setActiveTab(metric.tab)} className="group min-w-20 rounded-lg px-4 py-2 text-left hover:bg-white">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">{metric.label}</span>
              <span className="mt-0.5 flex items-center gap-1 text-xl font-semibold text-slate-900">
                {metric.value}<ArrowUpRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-emerald-700" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-[#fafbf9] px-5 py-3 sm:px-7">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Explore</span>
        <button
          onClick={() => setDomainFilter("ALL")}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${activeDomainFilter === "ALL" ? "border-[#245e49] bg-[#245e49] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}
        >
          All roles · {totalJobs}
        </button>
        {domains.map(({ id, label, count, icon: Icon, tone }) => (
          <button
            key={id}
            onClick={() => setDomainFilter(id)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${activeDomainFilter === id ? "border-[#245e49] bg-[#245e49] text-white" : tone}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label} · {count}
          </button>
        ))}
      </div>
    </section>
  );
}
