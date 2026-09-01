import { ApplicationTrack, CandidateProfile, UserAccount, ConsentSettings } from "./types";

const FAVOURITES_KEY = "vecta_favourite_companies";
const SAVED_JOBS_KEY = "vecta_saved_jobs";
const PIPELINE_KEY = "vecta_application_pipeline";
const PROFILE_KEY = "vecta_candidate_profile";
const USER_KEY = "vecta_active_user";
const CONSENT_KEY = "vecta_consent_settings";

export const DEFAULT_USER: UserAccount = {
  id: "user-alex-01",
  name: "Alex Mercer",
  email: "alex.mercer@vector-talent.io",
  role: "Candidate",
  avatar: "AM",
  isDemo: true,
  activePersonaId: "alex-ai-sec",
};

export const DEMO_PERSONAS: Record<string, { user: UserAccount; profile: CandidateProfile }> = {
  "alex-ai-sec": {
    user: {
      id: "user-alex-01",
      name: "Alex Mercer",
      email: "alex.mercer@vector-talent.io",
      role: "Candidate",
      avatar: "AM",
      isDemo: true,
      activePersonaId: "alex-ai-sec",
    },
    profile: {
      full_name: "Alex Mercer",
      current_title: "Senior AI & Security Infrastructure Engineer",
      primary_domain: "AI",
      years_experience: 6,
      skills: ["Python", "PyTorch", "LangChain", "Kubernetes", "AWS Security", "Terraform", "CI/CD", "Docker", "vLLM"],
      certifications: ["AWS Certified Solutions Architect", "CISSP", "DeepLearning.AI"],
      target_salary_min: 115000,
      preferred_work_mode: "Hybrid",
      resume_text: `Alex Mercer - Senior AI & Security Infrastructure Engineer
Experience:
• Architected scalable Generative AI agent pipelines with LangGraph and vLLM, reducing latency by 42% and processing 1.8M inferences daily.
• Engineered zero-trust security postures and automated SIEM threat detection using Terraform, AWS GuardDuty, and Python.
• Led cross-functional GRC alignment mapping ML data pipelines to ISO 27001 and EU AI Act technical guidelines.
• Managed £1.2M multi-cloud infrastructure budget across AWS and Kubernetes clusters with 99.99% availability.`,
    },
  },
  "elena-grc": {
    user: {
      id: "user-elena-02",
      name: "Elena Beaumont",
      email: "elena.beaumont@vector-talent.io",
      role: "Auditor / GRC Lead",
      avatar: "EB",
      isDemo: true,
      activePersonaId: "elena-grc",
    },
    profile: {
      full_name: "Elena Beaumont",
      current_title: "Director of AI Governance, Risk & Compliance",
      primary_domain: "Governance",
      years_experience: 9,
      skills: ["EU AI Act", "ISO 42001", "NIST AI RMF", "Algorithmic Risk Assessment", "Policy Design", "DORA", "NIS2"],
      certifications: ["IAPP AIGP", "CISM", "CIPP/E", "CRISC"],
      target_salary_min: 145000,
      preferred_work_mode: "Remote",
      resume_text: `Elena Beaumont - Director of AI Governance & Regulatory Compliance
Experience:
• Established enterprise AI governance frameworks for Tier-1 financial institutions aligning with EU AI Act and ISO 42001.
• Directed algorithmic bias auditing and third-party AI vendor assessments across 45 high-risk automated decision systems.
• Championed GDPR data protection compliance, CIPP/E standards, and NIS2 supply-chain security policies.`,
    },
  },
  "marcus-it": {
    user: {
      id: "user-marcus-03",
      name: "Marcus Sterling",
      email: "marcus.sterling@vector-talent.io",
      role: "Candidate",
      avatar: "MS",
      isDemo: true,
      activePersonaId: "marcus-it",
    },
    profile: {
      full_name: "Marcus Sterling",
      current_title: "Principal Cloud Platform & Enterprise IT Architect",
      primary_domain: "IT",
      years_experience: 8,
      skills: ["Terraform", "Kubernetes", "AWS Multi-Cloud", "Azure", "ArgoCD", "Microsoft 365", "Entra ID", "Observability"],
      certifications: ["AWS Solutions Architect Pro", "Azure Solutions Architect Expert", "CKA", "ITIL v4"],
      target_salary_min: 130000,
      preferred_work_mode: "Hybrid",
      resume_text: `Marcus Sterling - Principal Cloud & Enterprise IT Architect
Experience:
• Designed high-availability multi-region Kubernetes platform clusters handling 350M+ daily API transactions.
• Directed Microsoft 365 and Entra ID Zero Trust identity transformation for 3,000 corporate users across Europe.
• Established GitOps delivery pipelines with ArgoCD, decreasing infrastructure deployment cycle times by 65%.`,
    },
  },
};

export function getStoredUser(): UserAccount {
  if (typeof window === "undefined") return DEFAULT_USER;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_USER;
  } catch (e) {
    return DEFAULT_USER;
  }
}

export function saveStoredUser(user: UserAccount): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {}
}

export function getStoredProfile(): CandidateProfile {
  if (typeof window === "undefined") return DEMO_PERSONAS["alex-ai-sec"].profile;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEMO_PERSONAS["alex-ai-sec"].profile;
    const stored = JSON.parse(raw) as CandidateProfile;
    return {
      ...stored,
      preferred_locations: stored.preferred_locations ?? [],
      evidence: stored.evidence ?? [],
    };
  } catch (e) {
    return DEMO_PERSONAS["alex-ai-sec"].profile;
  }
}

export function saveStoredProfile(profile: CandidateProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {}
}

export function getStoredConsent(): ConsentSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredConsent(consent: ConsentSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch (e) {}
}

export function getStoredFavourites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVOURITES_KEY);
    return raw ? JSON.parse(raw) : ["vecta-ai-labs", "sentinel-guard-sec"];
  } catch (e) {
    return [];
  }
}

export function saveStoredFavourites(favs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favs));
  } catch (e) {}
}

export function getStoredSavedJobs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_JOBS_KEY);
    return raw ? JSON.parse(raw) : ["job-ai-01", "job-sec-01"];
  } catch (e) {
    return [];
  }
}

export function saveStoredSavedJobs(jobIds: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(jobIds));
  } catch (e) {}
}

export function getStoredPipeline(): ApplicationTrack[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PIPELINE_KEY);
    if (!raw) {
      return [
        {
          id: "track-demo-1",
          job_id: "job-ai-01",
          company_name: "CognitiveVector AI",
          job_title: "Senior Generative AI & Agentic Systems Engineer",
          domain: "AI",
          stage: "interviewing",
          date_added: "2026-08-30",
          date_updated: "2026-09-01",
          apply_url: "https://boards.greenhouse.io/cognitivevector/jobs/4829104",
          notes: "Round 2 Technical Architecture Deep-Dive scheduled for Thursday at 2 PM.",
          salary_target: "£130,000",
        },
        {
          id: "track-demo-2",
          job_id: "job-sec-01",
          company_name: "SentinelMesh Cyber",
          job_title: "Senior Cloud Security & SecOps Engineer",
          domain: "Security",
          stage: "applied",
          date_added: "2026-08-31",
          date_updated: "2026-08-31",
          apply_url: "https://jobs.ashbyhq.com/sentinelmesh/job-cloudsec-402",
          notes: "Applied via direct Ashby portal with tailored cover letter and CISSP verification.",
          salary_target: "£110,000",
        },
      ];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveStoredPipeline(pipeline: ApplicationTrack[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PIPELINE_KEY, JSON.stringify(pipeline));
  } catch (e) {}
}

// GDPR Article 17: Right to Erasure / 1-Click Data Wipe
export function wipeAllUserData(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(PIPELINE_KEY);
    localStorage.removeItem(SAVED_JOBS_KEY);
    localStorage.removeItem(FAVOURITES_KEY);
    localStorage.removeItem(CONSENT_KEY);
  } catch (e) {}
}

// GDPR Article 20: Right to Data Portability
export function exportAllUserData(): string {
  if (typeof window === "undefined") return "{}";
  const bundle = {
    exportDate: new Date().toISOString(),
    user: getStoredUser(),
    profile: getStoredProfile(),
    pipeline: getStoredPipeline(),
    savedJobs: getStoredSavedJobs(),
    favourites: getStoredFavourites(),
    consent: getStoredConsent(),
  };
  return JSON.stringify(bundle, null, 2);
}
