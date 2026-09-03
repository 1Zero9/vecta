"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { APP_VERSION, EXPORT_SCHEMA_VERSION } from "@/lib/version";
import { SKILL_TAXONOMY_VERSION } from "@/lib/skillTaxonomy";
import { Header } from "@/components/Header";
import { MetricCards } from "@/components/MetricCards";
import { JobBoard } from "@/components/JobBoard";
import { RadarTable } from "@/components/RadarTable";
import { MarketInsights } from "@/components/MarketInsights";
import { PipelineBoard } from "@/components/PipelineBoard";
import { FitEvaluatorModal } from "@/components/FitEvaluatorModal";
import { CopilotModal } from "@/components/CopilotModal";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { ProfileOnboardingModal } from "@/components/ProfileOnboardingModal";
import { CommandPalette } from "@/components/CommandPalette";
import { UserManagementModal } from "@/components/UserManagementModal";
import { GovernanceModal } from "@/components/GovernanceModal";
import { ConsentBanner } from "@/components/ConsentBanner";
import { WorkspaceLoading } from "@/components/WorkspaceLoading";
import { StatusNotice } from "@/components/ui/status-notice";

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
  CandidateProfile,
  UserAccount,
  WorkspaceTab,
  ConsentSettings,
  AuthenticatedAccount,
} from "@/lib/types";

import { 
  getStoredUser,
  saveStoredUser,
  getStoredProfile, 
  saveStoredProfile,
  getStoredFavourites, 
  saveStoredFavourites, 
  getStoredSavedJobs, 
  saveStoredSavedJobs, 
  getStoredPipeline, 
  saveStoredPipeline,
  getStoredConsent,
  saveStoredConsent,
  DEMO_PERSONAS,
  DEFAULT_USER
} from "@/lib/storage";
import { getProfileCompletion } from "@/lib/profileCompletion";
import { addJobToPipeline } from "@/lib/pipeline";

const APPLICATION_STAGE_LABELS: Record<ApplicationStage, string> = {
  saved: "Saved / Evaluating",
  drafting: "Drafting & Tailoring",
  applied: "Applied / Submitted",
  screening: "Initial Screen",
  interviewing: "Technical Interview",
  offer: "Offer / Negotiation",
  archived: "Archived",
};

export default function Home() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("jobs");
  const [activeDomain, setActiveDomain] = useState<DomainType | "ALL">("ALL");

  // Data State
  const [companies] = useState<Company[]>(companiesData as Company[]);
  const [jobs] = useState<Job[]>(jobsData as Job[]);
  const [benchmarks] = useState<SalaryBenchmark[]>(salaryBenchmarksData as SalaryBenchmark[]);
  const [archetypes] = useState<TalentArchetype[]>(talentArchetypesData as TalentArchetype[]);

  // Persistent User & Persona State
  const [currentUser, setCurrentUser] = useState<UserAccount>(DEFAULT_USER);
  const [profile, setProfile] = useState<CandidateProfile>(DEMO_PERSONAS["alex-ai-sec"].profile);
  const [consent, setConsent] = useState<ConsentSettings | null>(null);
  const [favouriteCompanyIds, setFavouriteCompanyIds] = useState<string[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [pipeline, setPipeline] = useState<ApplicationTrack[]>([]);
  const [authenticatedAccount, setAuthenticatedAccount] = useState<AuthenticatedAccount | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Modals & Drawers
  const [selectedJobForAudit, setSelectedJobForAudit] = useState<Job | null>(null);
  const [selectedJobForCopilot, setSelectedJobForCopilot] = useState<Job | null>(null);
  const [copilotInitialMode, setCopilotInitialMode] = useState<"tailor" | "interview">("tailor");
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isProfileOnboardingOpen, setIsProfileOnboardingOpen] = useState(false);
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isGovernanceModalOpen, setIsGovernanceModalOpen] = useState(false);

  // Toast / notification feedback
  const [notification, setNotification] = useState<{ message: string; tone: "success" | "info" } | null>(null);
  const notificationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, tone: "success" | "info" = "success") => {
    if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
    setNotification({ message, tone });
    notificationTimeout.current = setTimeout(() => setNotification(null), 3000);
  };

  // Hydrate persistent state on client mount
  useEffect(() => {
    let cancelled = false;
    setCurrentUser(getStoredUser());
    setProfile(getStoredProfile());
    setConsent(getStoredConsent());
    setFavouriteCompanyIds(getStoredFavourites());
    setSavedJobIds(getStoredSavedJobs());
    setPipeline(getStoredPipeline());
    setIsHydrated(true);

    fetch("/api/account", { method: "POST" })
      .then(async (response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (!cancelled && payload?.authenticated && payload.account) {
          setAuthenticatedAccount(payload.account as AuthenticatedAccount);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
    };
  }, []);

  // Switch demo persona
  const handleSelectPersona = (personaKey: "alex-ai-sec" | "elena-grc" | "marcus-it") => {
    const chosen = DEMO_PERSONAS[personaKey];
    if (chosen) {
      setCurrentUser(chosen.user);
      setProfile(chosen.profile);
      saveStoredUser(chosen.user);
      saveStoredProfile(chosen.profile);
      showToast(`Switched active account to ${chosen.user.name} (${chosen.profile.primary_domain})`);

      // Optionally sync to Prisma API in background
      fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: chosen.user, profile: chosen.profile }),
      }).catch((e) => console.warn("Prisma background sync warning:", e));
    }
  };

  const handleSaveCustomUser = (newUser: UserAccount, newProfile: CandidateProfile) => {
    setCurrentUser(newUser);
    setProfile(newProfile);
    saveStoredUser(newUser);
    saveStoredProfile(newProfile);
    showToast(`Account created & switched to ${newUser.name}`);

    // Sync to Prisma
    fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: newUser, profile: newProfile }),
    }).catch((e) => console.warn("Prisma sync warning:", e));
  };

  const handleAcceptConsent = () => {
    const settings: ConsentSettings = {
      gdprConsent: true,
      aiActConsent: true,
      analyticsConsent: false,
      consentedAt: new Date().toISOString(),
    };
    setConsent(settings);
    saveStoredConsent(settings);
    showToast("Privacy choices saved on this device.");

    // Log to Prisma
    fetch("/api/governance/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUser.id,
        gdprConsent: true,
        aiActConsent: true,
        analyticsConsent: false,
      }),
    }).catch((e) => console.warn("Consent sync warning:", e));
  };

  const handleToggleFavourite = (companyId: string) => {
    const wasFavourite = favouriteCompanyIds.includes(companyId);
    const next = wasFavourite
      ? favouriteCompanyIds.filter((id) => id !== companyId)
      : [...favouriteCompanyIds, companyId];
    setFavouriteCompanyIds(next);
    saveStoredFavourites(next);
    const company = companies.find((item) => item.id === companyId);
    if (company) showToast(`${wasFavourite ? "Removed" : "Saved"} ${company.name} ${wasFavourite ? "from" : "to"} your company list.`);
  };

  const handleToggleSaveJob = (jobId: string) => {
    const wasSaved = savedJobIds.includes(jobId);
    const next = wasSaved
      ? savedJobIds.filter((id) => id !== jobId)
      : [...savedJobIds, jobId];
    setSavedJobIds(next);
    saveStoredSavedJobs(next);
    const job = jobs.find((item) => item.id === jobId);
    if (job) showToast(`${wasSaved ? "Removed" : "Saved"} "${job.title}" ${wasSaved ? "from" : "to"} your role list.`);
  };

  const handleTrackInPipeline = (job: Job) => {
    const result = addJobToPipeline(pipeline, job);
    if (result.added) {
      setPipeline(result.pipeline);
      saveStoredPipeline(result.pipeline);
      showToast(`Added "${job.title}" to career pipeline.`);
    } else {
      showToast(`"${job.title}" is already in your career pipeline.`, "info");
    }
    setActiveTab("pipeline");
  };

  const handleUpdateStage = (id: string, newStage: ApplicationStage) => {
    const application = pipeline.find((item) => item.id === id);
    const updated = pipeline.map((p) =>
      p.id === id ? { ...p, stage: newStage, date_updated: new Date().toISOString().slice(0, 10) } : p
    );
    setPipeline(updated);
    saveStoredPipeline(updated);
    if (application) showToast(`Moved "${application.job_title}" to ${APPLICATION_STAGE_LABELS[newStage]}.`);
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    const application = pipeline.find((item) => item.id === id);
    const updated = pipeline.map((p) => (p.id === id ? { ...p, notes } : p));
    setPipeline(updated);
    saveStoredPipeline(updated);
    if (application) showToast(`Notes saved for "${application.job_title}".`);
  };

  const handleRemoveApplication = (id: string) => {
    const application = pipeline.find((item) => item.id === id);
    const updated = pipeline.filter((p) => p.id !== id);
    setPipeline(updated);
    saveStoredPipeline(updated);
    if (application) showToast(`Removed "${application.job_title}" from your pipeline.`);
  };

  const handleAddCustomApplication = (app: Partial<ApplicationTrack>) => {
    const newTrack: ApplicationTrack = {
      id: `track-custom-${Date.now()}`,
      job_id: `custom-${Date.now()}`,
      company_name: app.company_name || "Enterprise Tech",
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
    showToast(`Added custom application to pipeline.`);
  };

  const handleSaveProfile = (newProfile: CandidateProfile) => {
    setProfile(newProfile);
    saveStoredProfile(newProfile);
    showToast("Profile and vector match weights updated.");
  };

  const handleUpdateSkillMatchOverride = (
    jobId: string,
    requirement: string,
    priority: "required" | "preferred",
    decision: "include" | "exclude" | null,
  ) => {
    const existing = profile.skill_match_overrides ?? [];
    const sameRequirement = (candidate: (typeof existing)[number]) =>
      candidate.job_id === jobId
      && candidate.priority === priority
      && candidate.requirement.trim().toLocaleLowerCase() === requirement.trim().toLocaleLowerCase();
    const skill_match_overrides = decision
      ? [...existing.filter((candidate) => !sameRequirement(candidate)), { job_id: jobId, requirement, priority, decision }]
      : existing.filter((candidate) => !sameRequirement(candidate));
    const updatedProfile = { ...profile, skill_match_overrides };
    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
    showToast(decision ? "Vector Match correction saved." : "Vector Match correction removed.");
  };

  const handleDataWiped = () => {
    setCurrentUser(DEFAULT_USER);
    setProfile(DEMO_PERSONAS["alex-ai-sec"].profile);
    setFavouriteCompanyIds([]);
    setSavedJobIds([]);
    setPipeline([]);
    setConsent(null);
    showToast("All user telemetry, resume text, and pipeline records permanently erased.");
  };

  // Counts for metric cards
  const aiJobsCount = jobs.filter((j) => j.domain === "AI").length;
  const secJobsCount = jobs.filter((j) => j.domain === "Security").length;
  const govJobsCount = jobs.filter((j) => j.domain === "Governance").length;
  const itJobsCount = jobs.filter((j) => j.domain === "IT").length;
  const profileCompletion = getProfileCompletion(profile);

  if (!isHydrated) return <WorkspaceLoading />;

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 z-50 w-[min(92vw,34rem)] -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-200">
          <StatusNotice tone={notification.tone} className="bg-white shadow-lg">{notification.message}</StatusNotice>
        </div>
      )}

      {/* Top Streamlined Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === "governance") {
            setIsGovernanceModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        currentUser={currentUser}
        openCmdPalette={() => setIsCmdPaletteOpen(true)}
        openUserManagement={() => setIsUserManagementOpen(true)}
        openGovernance={() => setIsGovernanceModalOpen(true)}
        totalJobs={jobs.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Sleek Horizontal Telemetry Bar */}
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
          setActiveTab={(tab) => {
            if (tab === "governance") setIsGovernanceModalOpen(true);
            else setActiveTab(tab);
          }}
          openGovernance={() => setIsGovernanceModalOpen(true)}
          openProfileOnboarding={() => setIsProfileOnboardingOpen(true)}
          profileCompletion={profileCompletion.score}
        />

        {/* View Content */}
        {activeTab === "jobs" && (
          <JobBoard
            jobs={jobs}
            profile={profile}
            savedJobIds={savedJobIds}
            trackedJobIds={pipeline.map((application) => application.job_id)}
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

        {activeTab === "market" && (
          <MarketInsights
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

      {/* Clean Modern Footer */}
      <footer className="border-t border-slate-200 bg-white/70 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          <div className="flex max-w-2xl flex-wrap items-center gap-2">
            <Image src="/vecta-mark.png" alt="" width={24} height={24} className="h-6 w-6 object-contain" />
            <span>
              <span className="block font-bold text-slate-900">Vecta · your career, carried forward with clarity.</span>
              <span className="mt-0.5 block text-slate-400">Inspired by the Latin <em>vecta</em> — “carried forward” or “conveyed”.</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
            <button
              onClick={() => setIsGovernanceModalOpen(true)}
              className="text-amber-700 hover:underline"
            >
              Data controls & feature boundaries
            </button>
            <span>•</span>
            <button
              onClick={() => setIsUserManagementOpen(true)}
              className="text-sky-700 hover:underline"
            >
              Active Account: {currentUser.name}
            </button>
            <span>•</span>
            <span className="text-emerald-700">{authenticatedAccount?.persisted ? "Protected account connected" : "Local-first workspace"}</span>
            <span>•</span>
            <span title={`Skill taxonomy v${SKILL_TAXONOMY_VERSION} · Export schema v${EXPORT_SCHEMA_VERSION}`}>Vecta v{APP_VERSION}</span>
          </div>

        </div>
      </footer>

      {/* GDPR & EU AI Act Consent Banner */}
      {!consent && (
        <ConsentBanner
          onAcceptAll={handleAcceptConsent}
          onOpenGovernance={() => setIsGovernanceModalOpen(true)}
        />
      )}

      {/* User Management & Demo Persona Switcher Modal */}
      <UserManagementModal
        currentUser={currentUser}
        authenticatedAccount={authenticatedAccount}
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
        onSelectPersona={handleSelectPersona}
        onSaveCustomUser={handleSaveCustomUser}
        onOpenGovernance={() => setIsGovernanceModalOpen(true)}
      />

      {/* Governance, GDPR, EU AI Act & Disclaimers Modal */}
      <GovernanceModal
        isOpen={isGovernanceModalOpen}
        onClose={() => setIsGovernanceModalOpen(false)}
        onDataWiped={handleDataWiped}
      />

      {/* Vector Match & ATS Parseability Audit Modal */}
      <FitEvaluatorModal
        job={selectedJobForAudit}
        profile={profile}
        isOpen={!!selectedJobForAudit}
        onClose={() => setSelectedJobForAudit(null)}
        onOpenCopilot={(job, mode) => {
          setSelectedJobForCopilot(job);
          setCopilotInitialMode(mode);
        }}
        onOpenProfile={() => setIsProfileDrawerOpen(true)}
        onUpdateSkillMatchOverride={handleUpdateSkillMatchOverride}
      />

      {/* Application Copilot & STAR Interview Prep Modal */}
      <CopilotModal
        key={`${selectedJobForCopilot?.id ?? "none"}-${copilotInitialMode}`}
        job={selectedJobForCopilot}
        profile={profile}
        isOpen={!!selectedJobForCopilot}
        onClose={() => setSelectedJobForCopilot(null)}
        initialMode={copilotInitialMode}
      />

      {/* Profile & Vector Weights Editor Drawer */}
      <ProfileDrawer
        key={`${currentUser.id}-${isProfileDrawerOpen ? "open" : "closed"}`}
        profile={profile}
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        onSaveProfile={handleSaveProfile}
      />

      {/* Guided Candidate Profile Setup */}
      {isProfileOnboardingOpen && (
        <ProfileOnboardingModal
          profile={profile}
          onClose={() => setIsProfileOnboardingOpen(false)}
          onSave={(newProfile) => {
            handleSaveProfile(newProfile);
            showToast("Profile saved. Your role matches have been recalculated.");
          }}
        />
      )}

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCmdPaletteOpen}
        onOpen={() => setIsCmdPaletteOpen(true)}
        onClose={() => setIsCmdPaletteOpen(false)}
        jobs={jobs}
        companies={companies}
        benchmarks={benchmarks}
        onSelectJob={(job) => setSelectedJobForAudit(job)}
        setActiveTab={(tab) => {
          if (tab === "governance") setIsGovernanceModalOpen(true);
          else setActiveTab(tab);
        }}
        openProfileDrawer={() => setIsProfileDrawerOpen(true)}
      />

    </div>
  );
}
