import { ApplicationTrack, CandidateProfile } from "./types";

const FAVOURITES_KEY = "vecta_favourite_companies";
const SAVED_JOBS_KEY = "vecta_saved_jobs";
const PIPELINE_KEY = "vecta_application_pipeline";
const PROFILE_KEY = "vecta_candidate_profile";

export const DEFAULT_PROFILE: CandidateProfile = {
  full_name: "Alex Mercer",
  current_title: "Senior AI & Security Engineer",
  primary_domain: "AI",
  years_experience: 6,
  skills: ["Python", "PyTorch", "LangChain", "Kubernetes", "AWS Security", "Terraform", "CI/CD", "Docker", "vLLM"],
  certifications: ["AWS Certified Solutions Architect", "CISSP", "DeepLearning.AI"],
  target_salary_min: 110000,
  preferred_work_mode: "Hybrid",
  resume_text: `Alex Mercer - Senior AI & Security Infrastructure Engineer
Experience:
• Architected scalable Generative AI agent pipelines with LangGraph and vLLM, reducing latency by 42% and processing 1.8M inferences daily.
• Engineered zero-trust security postures and automated SIEM threat detection using Terraform, AWS GuardDuty, and Python.
• Led cross-functional GRC alignment mapping ML data pipelines to ISO 27001 and EU AI Act technical guidelines.
• Managed £1.2M multi-cloud infrastructure budget across AWS and Kubernetes clusters with 99.99% availability.`
};

export function getStoredFavourites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVOURITES_KEY);
    return raw ? JSON.parse(raw) : [];
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
    return raw ? JSON.parse(raw) : [];
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
      // Default sample pipeline item to demonstrate functionality
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
          salary_target: "£130,000"
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
          salary_target: "£110,000"
        }
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

export function getStoredProfile(): CandidateProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: CandidateProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {}
}
