"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MetricCards } from "@/components/MetricCards";
import { JobBoard } from "@/components/JobBoard";
import { RadarTable } from "@/components/RadarTable";
import { RecruiterLookup } from "@/components/RecruiterLookup";
import { PipelineBoard } from "@/components/PipelineBoard";
import { FitEvaluatorModal } from "@/components/FitEvaluatorModal";
import { CopilotModal } from "@/components/CopilotModal";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { CommandPalette } from "@/components/CommandPalette";

import companiesData from "@/data/companies.json";
import jobsData from "@/data/jobs.json";
import salaryBenchmarksData from "@/data/salaryBenchmarks.json";
import talentArchetypesData from "@/data/talentArchetypes.json";

import { 
  Job, 
  Company, 
  SalaryBenchmark, 
  TalentArchetype, 
  DomainType, 
  ApplicationTrack, 
  ApplicationStage,
  CandidateProfile 
} from "@/lib/types";

import { 
  getStoredFavourites, 
  saveStoredFavourites, 
  getStoredSavedJobs, 
  saveStoredSavedJobs, 
  getStoredPipeline, 
  saveStoredPipeline, 
  getStoredProfile, 
  saveStoredProfile 
} from "@/lib/storage";

export default function Home() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<"jobs" | "radar" | "recruiter" | "pipeline">("jobs");
  const [activeDomain, setActiveDomain] = useState<DomainType | "ALL">("ALL");
  const [isDark, setIsDark] = useState(true);

  // Data State
  const [companies] = useState<Company[]>(companiesData as Company[]);
  const [jobs] = useState<Job[]>(jobsData as Job[]);
  const [benchmarks] = useState<SalaryBenchmark[]>(salaryBenchmarksData as SalaryBenchmark[]);
  const [archetypes] = useState<TalentArchetype[]>(talentArchetypesData as TalentArchetype[]);

  // Persistent User State
  const [profile, setProfile] = useState<CandidateProfile>(getStoredProfile());
  const [favouriteCompanyIds, setFavouriteCompanyIds] = useState<string[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [pipeline, setPipeline] = useState<ApplicationTrack[]>([]);

  // Modal / Drawer State
  const [selectedJobForAudit, setSelectedJobForAudit] = useState<Job | null>(null);
  const [selectedJobForCopilot, setSelectedJobForCopilot] = useState<Job | null>(null);
  const [copilotInitialMode, setCopilotInitialMode] = useState<"tailor" | "interview">("tailor");
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);

  // Hydrate persistent state on client mount
  useEffect(() => {
    setFavouriteCompanyIds(getStoredFavourites());
    setSavedJobIds(getStoredSavedJobs());
    setPipeline(getStoredPipeline());
    setProfile(getStoredProfile());

    // Theme setup
    const savedTheme = localStorage.getItem("vecta_theme");
    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light");
    } else {
      setIsDark(true);
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("vecta_theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("vecta_theme", "light");
    }
  };

  const handleToggleFavourite = (companyId: string) => {
    const next = favouriteCompanyIds.includes(companyId)
      ? favouriteCompanyIds.filter((id) => id !== companyId)
      : [...favouriteCompanyIds, companyId];
    setFavouriteCompanyIds(next);
    saveStoredFavourites(next);
  };

  const handleToggleSaveJob = (jobId: string) => {
    const next = savedJobIds.includes(jobId)
      ? savedJobIds.filter((id) => id !== jobId)
      : [...savedJobIds, jobId];
    setSavedJobIds(next);
    saveStoredSavedJobs(next);
  };

  const handleTrackInPipeline = (job: Job) => {
    // Check if already in pipeline
    const existing = pipeline.find((p) => p.job_id === job.id);
    if (!existing) {
      const newTrack: ApplicationTrack = {
        id: `track-${Date.now()}`,
        job_id: job.id,
        company_name: job.company_name,
        job_title: job.title,
        domain: job.domain,
        stage: "saved",
        date_added: new Date().toISOString().slice(0, 10),
        date_updated: new Date().toISOString().slice(0, 10),
        apply_url: job.apply_url,
        salary_target: job.salary_min ? `£${(job.salary_min / 1000).toFixed(0)}k` : undefined,
        notes: `Added from Direct Jobs feed. Matching skills: ${job.req_skills.slice(0, 3).join(", ")}.`,
      };
      const updated = [newTrack, ...pipeline];
      setPipeline(updated);
      saveStoredPipeline(updated);
    }
    setActiveTab("pipeline");
  };

  const handleUpdateStage = (id: string, newStage: ApplicationStage) => {
    const updated = pipeline.map((p) =>
      p.id === id ? { ...p, stage: newStage, date_updated: new Date().toISOString().slice(0, 10) } : p
    );
    setPipeline(updated);
    saveStoredPipeline(updated);
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    const updated = pipeline.map((p) => (p.id === id ? { ...p, notes } : p));
    setPipeline(updated);
    saveStoredPipeline(updated);
  };

  const handleRemoveApplication = (id: string) => {
    const updated = pipeline.filter((p) => p.id !== id);
    setPipeline(updated);
    saveStoredPipeline(updated);
  };

  const handleAddCustomApplication = (app: Partial<ApplicationTrack>) => {
    const newTrack: ApplicationTrack = {
      id: `track-custom-${Date.now()}`,
      job_id: `custom-${Date.now()}`,
      company_name: app.company_name || "Enterprise Company",
      job_title: app.job_title || "Specialist",
      domain: app.domain || "AI",
      stage: app.stage || "saved",
      date_added: new Date().toISOString().slice(0, 10),
      date_updated: new Date().toISOString().slice(0, 10),
      apply_url: app.apply_url,
      salary_target: app.salary_target,
      notes: app.notes || "Added manually to pipeline tracker.",
    };
    const updated = [newTrack, ...pipeline];
    setPipeline(updated);
    saveStoredPipeline(updated);
  };

  const handleSaveProfile = (newProfile: CandidateProfile) => {
    setProfile(newProfile);
    saveStoredProfile(newProfile);
  };

  // Counts for metric cards
  const aiJobsCount = jobs.filter((j) => j.domain === "AI").length;
  const secJobsCount = jobs.filter((j) => j.domain === "Security").length;
  const govJobsCount = jobs.filter((j) => j.domain === "Governance").length;
  const itJobsCount = jobs.filter((j) => j.domain === "IT").length;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-[#F9FAFB] selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top HUD Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        openCmdPalette={() => setIsCmdPaletteOpen(true)}
        openProfileDrawer={() => setIsProfileDrawerOpen(true)}
        candidateName={profile.full_name}
        totalLiveJobs={jobs.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Dynamic Interactive KPI Cards */}
        <MetricCards
          totalCompanies={companies.length}
          totalJobs={jobs.length}
          aiJobsCount={aiJobsCount}
          secJobsCount={secJobsCount}
          govJobsCount={govJobsCount}
          itJobsCount={itJobsCount}
          pipelineCount={pipeline.length}
          activeDomainFilter={activeDomain}
          setDomainFilter={setActiveDomain}
          setActiveTab={setActiveTab}
        />

        {/* View Content Area */}
        {activeTab === "jobs" && (
          <JobBoard
            jobs={jobs}
            profile={profile}
            savedJobIds={savedJobIds}
            onToggleSaveJob={handleToggleSaveJob}
            onOpenFitEvaluator={(job) => setSelectedJobForAudit(job)}
            onOpenCopilot={(job, mode) => {
              setSelectedJobForCopilot(job);
              setCopilotInitialMode(mode);
            }}
            onTrackInPipeline={handleTrackInPipeline}
            activeDomain={activeDomain}
            setActiveDomain={setActiveDomain}
          />
        )}

        {activeTab === "radar" && (
          <RadarTable
            companies={companies}
            favouriteCompanyIds={favouriteCompanyIds}
            onToggleFavourite={handleToggleFavourite}
            activeDomain={activeDomain}
            setActiveDomain={setActiveDomain}
          />
        )}

        {activeTab === "recruiter" && (
          <RecruiterLookup
            benchmarks={benchmarks}
            archetypes={archetypes}
            activeDomain={activeDomain}
            setActiveDomain={setActiveDomain}
          />
        )}

        {activeTab === "pipeline" && (
          <PipelineBoard
            pipeline={pipeline}
            onUpdateStage={handleUpdateStage}
            onUpdateNotes={handleUpdateNotes}
            onRemoveApplication={handleRemoveApplication}
            onAddCustomApplication={handleAddCustomApplication}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 transition-colors mt-12">
        <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold font-mono text-xs">
              V
            </div>
            <span className="font-bold text-white">Vecta // Career Vector Navigator</span>
            <span>•</span>
            <span>Latin: vehere ("to convey / carry / transport")</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Specialized in: IT · AI · Governance · Security</span>
            <span>•</span>
            <span className="text-emerald-400">Live ATS Connector Engine Active</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <FitEvaluatorModal
        job={selectedJobForAudit}
        profile={profile}
        isOpen={!!selectedJobForAudit}
        onClose={() => setSelectedJobForAudit(null)}
        onOpenCopilot={(job, mode) => {
          setSelectedJobForCopilot(job);
          setCopilotInitialMode(mode);
        }}
      />

      <CopilotModal
        job={selectedJobForCopilot}
        profile={profile}
        isOpen={!!selectedJobForCopilot}
        onClose={() => setSelectedJobForCopilot(null)}
        initialMode={copilotInitialMode}
      />

      <ProfileDrawer
        profile={profile}
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        onSaveProfile={handleSaveProfile}
      />

      <CommandPalette
        isOpen={isCmdPaletteOpen}
        onClose={() => setIsCmdPaletteOpen(false)}
        jobs={jobs}
        companies={companies}
        benchmarks={benchmarks}
        onSelectJob={(job) => {
          setSelectedJobForAudit(job);
        }}
        setActiveTab={setActiveTab}
        openProfileDrawer={() => setIsProfileDrawerOpen(true)}
        toggleTheme={toggleTheme}
      />

    </div>
  );
}
