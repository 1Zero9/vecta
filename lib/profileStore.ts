import type { CandidateProfile } from "./types";

export async function loadAuthenticatedProfile(_userId: string): Promise<CandidateProfile | null> {
  void _userId;
  return null;
}

export async function saveAuthenticatedProfile(_userId: string, _profile: CandidateProfile): Promise<void> {
  void _userId;
  void _profile;
  throw new Error("Protected profile storage is unavailable in this runtime.");
}
