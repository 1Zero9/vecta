import { env } from "cloudflare:workers";
import { loadProfileWithDatabase, saveProfileWithDatabase, type D1ProfileDatabase } from "./d1ProfileStore";
import type { CandidateProfile } from "./types";

function getDatabase(): D1ProfileDatabase {
  const database = (env as unknown as { DB?: D1ProfileDatabase }).DB;
  if (!database) throw new Error("The protected profile database is unavailable.");
  return database;
}

export function loadAuthenticatedProfile(userId: string): Promise<CandidateProfile | null> {
  return loadProfileWithDatabase(getDatabase(), userId);
}

export function saveAuthenticatedProfile(userId: string, profile: CandidateProfile): Promise<void> {
  return saveProfileWithDatabase(getDatabase(), userId, profile);
}
