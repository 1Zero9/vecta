import { CandidateProfile, Job } from "@/lib/types";

export function makeProfile(overrides: Partial<CandidateProfile> = {}): CandidateProfile {
  return {
    full_name: "Test Candidate",
    current_title: "Senior Cloud Engineer",
    primary_domain: "IT",
    years_experience: 8,
    skills: ["AWS", "Kubernetes", "Terraform", "Python", "Cloud Security"],
    certifications: ["CKA"],
    target_salary_min: 100000,
    preferred_work_mode: "Hybrid",
    preferred_locations: ["Dublin"],
    resume_text: "Architected a secure cloud platform and automated delivery with Terraform. ".repeat(8),
    evidence: [],
    ...overrides,
  };
}

export function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: "job-test",
    company_id: "company-test",
    company_name: "Test Company",
    title: "Senior Platform Engineer",
    domain: "IT",
    subdomain: "Cloud",
    seniority: "Senior",
    location: "Dublin",
    work_mode: "Hybrid",
    currency: "GBP",
    posted_date: "2026-09-01",
    ats_type: "custom",
    apply_url: "https://example.com/apply",
    req_skills: ["AWS", "Kubernetes", "Terraform"],
    preferred_skills: ["Python", "Cloud Security"],
    certifications: ["CKA"],
    summary: "Build and secure cloud platforms.",
    key_responsibilities: ["Own the platform."],
    requirements: ["Cloud experience."],
    ...overrides,
  };
}
