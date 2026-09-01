"use client";

import React, { useState, useEffect } from "react";
import { Job, Company, SalaryBenchmark } from "@/lib/types";
import { 
  Search, 
  Briefcase, 
  Building2, 
  BarChart3, 
  Kanban, 
  Moon, 
  Sun, 
  UserCheck, 
  X, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
  companies: Company[];
  benchmarks: SalaryBenchmark[];
  onSelectJob: (job: Job) => void;
  setActiveTab: (tab: "jobs" | "radar" | "recruiter" | "pipeline" | "governance") => void;
  openProfileDrawer: () => void;
  toggleTheme: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  jobs,
  companies,
  benchmarks,
  onSelectJob,
  setActiveTab,
  openProfileDrawer,
  toggleTheme,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
          setQuery("");
        }
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search jobs
  const matchedJobs = q
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company_name.toLowerCase().includes(q) ||
          j.req_skills.some((s) => s.toLowerCase().includes(q))
      ).slice(0, 4)
    : [];

  // Search companies
  const matchedCompanies = q
    ? companies.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tech_stack.some((t) => t.toLowerCase().includes(q)) ||
          c.compliance_tags.some((comp) => comp.toLowerCase().includes(q))
      ).slice(0, 3)
    : [];

  // Search benchmarks
  const matchedBenchmarks = q
    ? benchmarks.filter(
        (b) =>
          b.role_title.toLowerCase().includes(q) ||
          b.domain.toLowerCase().includes(q)
      ).slice(0, 2)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-950/80">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search jobs, companies, skills, or quick actions..."
            className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base"
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Navigation list */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3 text-xs">
          
          {/* Quick Actions (when query is empty) */}
          {!q && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-slate-500">
                Quick Navigation & Actions
              </div>

              <div
                onClick={() => {
                  setActiveTab("jobs");
                  onClose();
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">Browse Direct ATS Jobs (IT, AI, GRC, Security)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </div>

              <div
                onClick={() => {
                  setActiveTab("radar");
                  onClose();
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold">Explore Company Tech Radar & Compliance Hub</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </div>

              <div
                onClick={() => {
                  setActiveTab("recruiter");
                  onClose();
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span className="font-bold">View Salary Benchmarks & Talent Archetypes</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </div>

              <div
                onClick={() => {
                  setActiveTab("pipeline");
                  onClose();
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Kanban className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold">Open Career Application Kanban Pipeline</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </div>

              <div
                onClick={() => {
                  openProfileDrawer();
                  onClose();
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">Edit Candidate Profile & Vector Match Settings</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </div>

              <div
                onClick={() => {
                  toggleTheme();
                  onClose();
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Moon className="w-4 h-4 text-amber-400" />
                  <span className="font-bold">Toggle Dark / Light Theme</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          )}

          {/* Matched Jobs */}
          {matchedJobs.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-slate-500">
                Matching Job Listings
              </div>
              {matchedJobs.map((j) => (
                <div
                  key={j.id}
                  onClick={() => {
                    onSelectJob(j);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-bold text-white text-xs">{j.title}</div>
                    <div className="text-[11px] text-slate-400">{j.company_name} // {j.domain}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                    View
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Matched Companies */}
          {matchedCompanies.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-slate-500">
                Matching Companies in Radar
              </div>
              {matchedCompanies.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveTab("radar");
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-bold text-white text-xs">{c.name}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-sm">{c.tagline}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold">
                    {c.domain}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Matched Benchmarks */}
          {matchedBenchmarks.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-slate-500">
                Matching Salary Benchmarks
              </div>
              {matchedBenchmarks.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setActiveTab("recruiter");
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-bold text-white text-xs">{b.role_title}</div>
                    <div className="text-[11px] text-slate-400">Median £{(b.p50 / 1000).toFixed(0)}k // {b.market_trend}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
                    {b.domain}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Tip: Press ESC to close</span>
          <span>Vecta Navigation Hub</span>
        </div>

      </div>
    </div>
  );
}
