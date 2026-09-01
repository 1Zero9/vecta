"use client";

import React, { useState } from "react";
import { SalaryBenchmark, TalentArchetype, DomainType } from "@/lib/types";
import { 
  TrendingUp, 
  Banknote, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  HelpCircle, 
  Award,
  BarChart3,
  Layers,
  ChevronRight
} from "lucide-react";

interface RecruiterLookupProps {
  benchmarks: SalaryBenchmark[];
  archetypes: TalentArchetype[];
  activeDomain: DomainType | "ALL";
  setActiveDomain: (d: DomainType | "ALL") => void;
}

export function RecruiterLookup({
  benchmarks,
  archetypes,
  activeDomain,
  setActiveDomain,
}: RecruiterLookupProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<TalentArchetype | null>(
    archetypes.length > 0 ? archetypes[0] : null
  );

  const filteredBenchmarks = benchmarks.filter((b) => {
    if (activeDomain !== "ALL" && b.domain !== activeDomain) return false;
    return true;
  });

  const filteredArchetypes = archetypes.filter((a) => {
    if (activeDomain !== "ALL" && a.domain !== activeDomain) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold uppercase">
              Recruiter & Market Telemetry
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Compensation Benchmarks & Talent Archetypes
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Market compensation percentiles (P25 - P90), demanded skill matrices, and structured interview rubrics specifically verified for <span className="text-cyan-400 font-semibold">AI/ML</span>, <span className="text-rose-400 font-semibold">Cybersecurity</span>, <span className="text-amber-400 font-semibold">Governance & GRC</span>, and <span className="text-indigo-400 font-semibold">IT Infrastructure</span>.
          </p>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-4 relative z-10 border-t border-white/5 mt-4">
          <button
            onClick={() => setActiveDomain("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeDomain === "ALL"
                ? "bg-white text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            All Disciplines
          </button>
          <button
            onClick={() => setActiveDomain("AI")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeDomain === "AI"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-cyan-400"
            }`}
          >
            AI & Machine Learning
          </button>
          <button
            onClick={() => setActiveDomain("Security")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeDomain === "Security"
                ? "bg-rose-500 text-white shadow-md"
                : "bg-slate-800 text-rose-400"
            }`}
          >
            Cybersecurity
          </button>
          <button
            onClick={() => setActiveDomain("Governance")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeDomain === "Governance"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-amber-400"
            }`}
          >
            Governance & GRC
          </button>
          <button
            onClick={() => setActiveDomain("IT")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeDomain === "IT"
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-slate-800 text-indigo-400"
            }`}
          >
            IT & Cloud Architecture
          </button>
        </div>
      </div>

      {/* Section 1: Salary Benchmarks Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              Compensation Percentiles by Role
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            UK & European Tech Market Baseline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBenchmarks.map((b) => (
            <div
              key={b.id}
              className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 space-y-4 hover:border-emerald-500/40 transition-all shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {b.domain} // {b.seniority}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white mt-1.5">
                    {b.role_title}
                  </h4>
                </div>

                <div className="flex items-center gap-1 text-xs font-mono font-bold px-2 py-1 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{b.market_trend}</span>
                </div>
              </div>

              {/* Percentile visual meter */}
              <div className="space-y-2 pt-2 bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">P25</div>
                    <div className="font-mono font-bold text-slate-300">£{(b.p25 / 1000).toFixed(0)}k</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-400 font-bold uppercase">P50 (Median)</div>
                    <div className="font-mono font-black text-emerald-400">£{(b.p50 / 1000).toFixed(0)}k</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">P75</div>
                    <div className="font-mono font-bold text-slate-300">£{(b.p75 / 1000).toFixed(0)}k</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-cyan-400 font-bold uppercase">P90 (Top)</div>
                    <div className="font-mono font-black text-cyan-300">£{(b.p90 / 1000).toFixed(0)}k</div>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-slate-700 w-1/4"></div>
                  <div className="h-full bg-emerald-500 w-1/4"></div>
                  <div className="h-full bg-teal-400 w-1/4"></div>
                  <div className="h-full bg-cyan-400 w-1/4"></div>
                </div>
              </div>

              {/* Demanded Skills & Certs */}
              <div className="space-y-2 pt-1 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Top Demanded Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {b.top_demanded_skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Key Certifications:</span>
                  <div className="flex flex-wrap gap-1">
                    {b.primary_certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono text-[11px]"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Talent Archetypes & Hiring Rubrics */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">
            Talent Archetypes & Interview Rubrics
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Archetype selector list */}
          <div className="space-y-2">
            {filteredArchetypes.map((arch) => {
              const isSelected = selectedArchetype?.id === arch.id;
              return (
                <div
                  key={arch.id}
                  onClick={() => setSelectedArchetype(arch)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500/40"
                      : "bg-slate-900/60 hover:bg-slate-900 border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      {arch.domain}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {arch.average_salary_range}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {arch.title}
                  </h4>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep Archetype Blueprint */}
          {selectedArchetype && (
            <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    {selectedArchetype.domain} Archetype
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    {selectedArchetype.title}
                  </h3>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono font-bold text-cyan-300">
                  Seniority: {selectedArchetype.typical_seniority}
                </div>
              </div>

              {/* Core Deliverables */}
              <div className="space-y-2 text-xs sm:text-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Key Deliverables & Responsibilities</span>
                </h4>
                <ul className="space-y-1.5 pl-2 text-slate-300">
                  {selectedArchetype.key_deliverables.map((deliv, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Standard Technical Skills & Certifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Core Skills & Frameworks
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedArchetype.standard_skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Industry Certifications
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedArchetype.key_certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-xs font-mono border border-amber-500/20"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Interview Questions */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span>High-Signal Interview Questions</span>
                </h4>
                <div className="space-y-2">
                  {selectedArchetype.interview_question_samples.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium"
                    >
                      <span className="text-cyan-400 font-mono font-bold mr-2">Q{idx + 1}:</span>
                      {q}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
