"use client";

import React, { useState } from "react";
import { 
  Job, 
  DomainType, 
  SeniorityLevel, 
  WorkMode, 
  CandidateProfile 
} from "@/lib/types";
import { evaluateVectorFit } from "@/lib/fitEngine";
import { 
  Search, 
  SlidersHorizontal, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight,
  Shield,
  Cpu,
  CheckCircle,
  Building,
  MapPin,
  Banknote,
  Flame,
  Zap,
  HelpCircle
} from "lucide-react";

interface JobBoardProps {
  jobs: Job[];
  profile: CandidateProfile;
  savedJobIds: string[];
  onToggleSaveJob: (jobId: string) => void;
  onOpenFitEvaluator: (job: Job) => void;
  onOpenCopilot: (job: Job, mode: "tailor" | "interview") => void;
  onTrackInPipeline: (job: Job) => void;
  activeDomain: DomainType | "ALL";
  setActiveDomain: (d: DomainType | "ALL") => void;
}

export function JobBoard({
  jobs,
  profile,
  savedJobIds,
  onToggleSaveJob,
  onOpenFitEvaluator,
  onOpenCopilot,
  onTrackInPipeline,
  activeDomain,
  setActiveDomain,
}: JobBoardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeniority, setSelectedSeniority] = useState<string>("ALL");
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>("ALL");
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    // Domain
    if (activeDomain !== "ALL" && job.domain !== activeDomain) return false;

    // Seniority
    if (selectedSeniority !== "ALL" && !job.seniority.includes(selectedSeniority)) return false;

    // Work Mode
    if (selectedWorkMode !== "ALL" && job.work_mode !== selectedWorkMode) return false;

    // Saved only
    if (showSavedOnly && !savedJobIds.includes(job.id)) return false;

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const titleMatch = job.title.toLowerCase().includes(q);
      const companyMatch = job.company_name.toLowerCase().includes(q);
      const skillMatch = job.req_skills.some((s) => s.toLowerCase().includes(q));
      const summaryMatch = job.summary.toLowerCase().includes(q);
      const standardMatch = job.governance_standards?.some((st) => st.toLowerCase().includes(q));
      if (!titleMatch && !companyMatch && !skillMatch && !summaryMatch && !standardMatch) {
        return false;
      }
    }

    return true;
  });

  const getDomainBadge = (domain: DomainType) => {
    switch (domain) {
      case "AI":
        return <span className="badge-ai px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> AI & Machine Learning</span>;
      case "Security":
        return <span className="badge-security px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"><Shield className="w-3 h-3" /> Cybersecurity</span>;
      case "Governance":
        return <span className="badge-governance px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> Governance & GRC</span>;
      case "IT":
        return <span className="badge-it px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"><Cpu className="w-3 h-3" /> IT Infrastructure</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Multi-Faceted Filter Toolbar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 shadow-xl border border-white/10 space-y-4">
        
        {/* Top Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, company, skill (e.g. PyTorch, eBPF, ISO 42001, Terraform, CISSP)..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm sm:text-base transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
          
          {/* Domain Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveDomain("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDomain === "ALL"
                  ? "bg-white text-slate-950 shadow-md"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              All Vectors
            </button>
            <button
              onClick={() => setActiveDomain("AI")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDomain === "AI"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-slate-800/80 text-cyan-400 hover:bg-cyan-950/40"
              }`}
            >
              AI / GenAI
            </button>
            <button
              onClick={() => setActiveDomain("Security")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDomain === "Security"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "bg-slate-800/80 text-rose-400 hover:bg-rose-950/40"
              }`}
            >
              Cybersecurity
            </button>
            <button
              onClick={() => setActiveDomain("Governance")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDomain === "Governance"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-800/80 text-amber-400 hover:bg-amber-950/40"
              }`}
            >
              Governance & GRC
            </button>
            <button
              onClick={() => setActiveDomain("IT")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDomain === "IT"
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-800/80 text-indigo-400 hover:bg-indigo-950/40"
              }`}
            >
              IT & Cloud
            </button>
          </div>

          {/* Dropdown selects & Bookmark toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Seniority */}
            <select
              value={selectedSeniority}
              onChange={(e) => setSelectedSeniority(e.target.value)}
              className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Seniorities</option>
              <option value="Junior">Junior / Associate</option>
              <option value="Mid">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead / Staff</option>
              <option value="Director">Director / VP / C-Level</option>
            </select>

            {/* Work Mode */}
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Work Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>

            {/* Saved Jobs Toggle */}
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                showSavedOnly
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-800/80 text-slate-300 hover:text-white"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? "fill-slate-950" : ""}`} />
              <span>Saved ({savedJobIds.length})</span>
            </button>
          </div>

        </div>

      </div>

      {/* Jobs Results List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-dashed border-white/10 p-8">
            <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-200">No matching vacancies found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
              Try broadening your search keywords or switching between IT, AI, Governance, and Security domains.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveDomain("ALL");
                setSelectedSeniority("ALL");
                setSelectedWorkMode("ALL");
                setShowSavedOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const fit = evaluateVectorFit(profile, job);
            const isSaved = savedJobIds.includes(job.id);

            return (
              <div
                key={job.id}
                className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-emerald-500/40 transition-all shadow-lg group relative overflow-hidden"
              >
                {/* Glow accent for high vector match (>80%) */}
                {fit.overall_score >= 80 && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none"></div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  
                  {/* Left Column: Role Details & Meta */}
                  <div className="space-y-2.5 flex-1">
                    
                    {/* Domain & ATS Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {getDomainBadge(job.domain)}
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 border border-white/10 text-slate-300 text-xs font-medium">
                        {job.seniority}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 border border-white/10 text-slate-300 text-xs font-medium">
                        {job.work_mode}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono uppercase tracking-wider">
                        Direct {job.ats_type}
                      </span>
                    </div>

                    {/* Job Title & Company */}
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                        {job.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                        <span className="text-slate-200 font-semibold flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-emerald-400" />
                          {job.company_name}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location}
                        </span>
                        {job.salary_min && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                              <Banknote className="w-3.5 h-3.5" />
                              £{(job.salary_min / 1000).toFixed(0)}k – £{(job.salary_max! / 1000).toFixed(0)}k
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Summary Description */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
                      {job.summary}
                    </p>

                    {/* Skills & Governance Standards Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {job.req_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-white/5 text-slate-200 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.governance_standards?.map((gov, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold"
                        >
                          {gov}
                        </span>
                      ))}
                    </div>

                  </div>

                  {/* Right Column: AI Vector Match Score & Action Cluster */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between lg:justify-start gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10">
                    
                    {/* Vector Fit Meter */}
                    <div
                      onClick={() => onOpenFitEvaluator(job)}
                      className="cursor-pointer select-none px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 hover:border-emerald-500/50 transition-all flex items-center gap-3 group/score"
                      title="Click to view Vector Fit breakdown and ATS parseability"
                    >
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Vector Match
                        </div>
                        <div className="text-xs text-slate-500 group-hover/score:text-emerald-400">
                          {fit.matching_skills.length} matching skills
                        </div>
                      </div>

                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-base shadow-md ${
                        fit.overall_score >= 80 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                          : fit.overall_score >= 60 
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" 
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}>
                        {fit.overall_score}%
                      </div>
                    </div>

                    {/* Action Buttons Cluster */}
                    <div className="flex flex-wrap items-center gap-2">
                      
                      {/* Save Job */}
                      <button
                        onClick={() => onToggleSaveJob(job.id)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                          isSaved
                            ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                            : "bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-400 hover:text-white"
                        }`}
                        title={isSaved ? "Remove from saved" : "Save role"}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? "fill-slate-950" : ""}`} />
                      </button>

                      {/* Tailor Application (Copilot) */}
                      <button
                        onClick={() => onOpenCopilot(job, "tailor")}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                        title="Generate tailored cover letter & resume bullets"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Tailor CV</span>
                      </button>

                      {/* STAR Interview Prep */}
                      <button
                        onClick={() => onOpenCopilot(job, "interview")}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                        title="Generate role-specific STAR interview questions & bridge answers"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>STAR Prep</span>
                      </button>

                      {/* Track in Pipeline */}
                      <button
                        onClick={() => onTrackInPipeline(job)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                        title="Add to Kanban Career Pipeline"
                      >
                        <BookmarkCheck className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Track</span>
                      </button>

                      {/* Direct Apply ATS Button */}
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all group/btn"
                      >
                        <span>Apply Direct</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>

                    </div>

                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
