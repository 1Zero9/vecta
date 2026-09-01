import { CandidateProfile } from "./types";

export interface ProfileCompletion {
  score: number;
  completed: number;
  total: number;
  missing: string[];
}

export function getProfileCompletion(profile: CandidateProfile): ProfileCompletion {
  const checks = [
    { label: "current role", weight: 15, complete: profile.current_title.trim().length > 2 },
    { label: "career domain", weight: 10, complete: Boolean(profile.primary_domain) },
    { label: "experience", weight: 5, complete: profile.years_experience > 0 },
    { label: "preferred location", weight: 10, complete: (profile.preferred_locations?.length ?? 0) > 0 },
    { label: "work preference", weight: 10, complete: Boolean(profile.preferred_work_mode) },
    { label: "salary expectation", weight: 10, complete: (profile.target_salary_min ?? 0) > 0 },
    { label: "at least three skills", weight: 20, complete: profile.skills.length >= 3 },
    { label: "certifications", weight: 5, complete: profile.certifications.length > 0 },
    {
      label: "profile evidence",
      weight: 15,
      complete: profile.resume_text.trim().length >= 150 || (profile.evidence?.length ?? 0) > 0,
    },
  ];

  const score = checks.reduce((total, check) => total + (check.complete ? check.weight : 0), 0);

  return {
    score,
    completed: checks.filter((check) => check.complete).length,
    total: checks.length,
    missing: checks.filter((check) => !check.complete).map((check) => check.label),
  };
}
