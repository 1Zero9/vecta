"use client";

import React, { useState, useEffect } from "react";
import { Job, Company, SalaryBenchmark } from "@/lib/types";
import { 
  Search, 
  Briefcase, 
  Building2, 
  BarChart3, 
  Kanban, 
  UserCheck, 
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";

interface CommandPaletteProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  jobs: Job[];
  companies: Company[];
  benchmarks: SalaryBenchmark[];
  onSelectJob: (job: Job) => void;
  setActiveTab: (tab: "jobs" | "radar" | "recruiter" | "pipeline" | "governance") => void;
  openProfileDrawer: () => void;
}

export function CommandPalette({
  isOpen,
  onOpen,
  onClose,
  jobs,
  companies,
  benchmarks,
  onSelectJob,
  setActiveTab,
  openProfileDrawer,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery("");
          onOpen();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onOpen]);

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
    <DialogShell
      titleId="command-palette-title"
      title="Search Vecta"
      description="Find roles, companies, market benchmarks, or move to another workspace."
      icon={<Search className="h-5 w-5" />}
      onClose={onClose}
      closeLabel="Close search"
      size="md"
      bodyClassName="p-0 sm:p-0"
      footer={<div className="flex items-center justify-between text-[11px] text-slate-500"><span>Use Tab to move through results</span><span>Escape to close</span></div>}
    >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 bg-slate-50">
          <Search className="w-5 h-5 text-emerald-700 shrink-0" />
          <input
            type="text"
            autoFocus
            aria-label="Search roles, companies, and benchmarks"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search jobs, companies, skills, or quick actions..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-sm sm:text-base"
          />
        </div>

        {/* Results / Navigation list */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3 text-xs">
          
          {/* Quick Actions (when query is empty) */}
          {!q && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-slate-500">
                Quick Navigation & Actions
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  setActiveTab("jobs");
                  onClose();
                }}
                className="h-auto w-full justify-between px-3 py-2.5 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold">Browse Direct ATS Jobs (IT, AI, GRC, Security)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setActiveTab("radar");
                  onClose();
                }}
                className="h-auto w-full justify-between px-3 py-2.5 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-sky-700" />
                  <span className="font-bold">Explore Company Tech Radar & Compliance Hub</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setActiveTab("recruiter");
                  onClose();
                }}
                className="h-auto w-full justify-between px-3 py-2.5 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-amber-700" />
                  <span className="font-bold">View Salary Benchmarks & Talent Archetypes</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setActiveTab("pipeline");
                  onClose();
                }}
                className="h-auto w-full justify-between px-3 py-2.5 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Kanban className="w-4 h-4 text-indigo-700" />
                  <span className="font-bold">Open Career Application Kanban Pipeline</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  openProfileDrawer();
                  onClose();
                }}
                className="h-auto w-full justify-between px-3 py-2.5 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold">Edit Candidate Profile & Vector Match Settings</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Button>

            </div>
          )}

          {/* Matched Jobs */}
          {matchedJobs.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-slate-500">
                Matching Job Listings
              </div>
              {matchedJobs.map((j) => (
                <Button
                  variant="ghost"
                  key={j.id}
                  onClick={() => {
                    onSelectJob(j);
                    onClose();
                  }}
                  className="h-auto w-full justify-between p-2.5 text-left"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{j.title}</div>
                    <div className="text-[11px] text-slate-400">{j.company_name} · {j.domain}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 text-[10px] font-mono font-bold">
                    View
                  </span>
                </Button>
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
                <Button
                  variant="ghost"
                  key={c.id}
                  onClick={() => {
                    setActiveTab("radar");
                    onClose();
                  }}
                  className="h-auto w-full justify-between p-2.5 text-left"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{c.name}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-sm">{c.tagline}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-sky-700 text-[10px] font-mono font-bold">
                    {c.domain}
                  </span>
                </Button>
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
                <Button
                  variant="ghost"
                  key={b.id}
                  onClick={() => {
                    setActiveTab("recruiter");
                    onClose();
                  }}
                  className="h-auto w-full justify-between p-2.5 text-left"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{b.role_title}</div>
                    <div className="text-[11px] text-slate-400">Median £{(b.p50 / 1000).toFixed(0)}k · {b.market_trend}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 text-[10px] font-mono font-bold">
                    {b.domain}
                  </span>
                </Button>
              ))}
            </div>
          )}

        </div>

    </DialogShell>
  );
}
