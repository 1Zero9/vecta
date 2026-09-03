import type { CandidateProfile } from "./types";

export type ProfileProtectionState = "unavailable" | "checking" | "local-only" | "protected" | "conflict" | "saving" | "error";

function canonicalProfile(profile: CandidateProfile) {
  return {
    ...profile,
    skills: [...profile.skills].sort(),
    certifications: [...profile.certifications].sort(),
    preferred_locations: [...(profile.preferred_locations ?? [])].sort(),
    evidence: [...(profile.evidence ?? [])]
      .map((item) => ({ ...item, claims: [...item.claims].sort() }))
      .sort((left, right) => left.id.localeCompare(right.id)),
    skill_match_overrides: [...(profile.skill_match_overrides ?? [])]
      .sort((left, right) => `${left.job_id}:${left.requirement}`.localeCompare(`${right.job_id}:${right.requirement}`)),
  };
}

export function profilesAreEquivalent(left: CandidateProfile, right: CandidateProfile): boolean {
  return JSON.stringify(canonicalProfile(left)) === JSON.stringify(canonicalProfile(right));
}
