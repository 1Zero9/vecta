import type { CandidateProfile, ProfileEvidence, SkillMatchOverride } from "./types";
import type { D1DatabaseLike, D1PreparedStatementLike } from "./d1AccountStore";

interface ProfileRow {
  full_name: string;
  current_title: string;
  primary_domain: CandidateProfile["primary_domain"];
  years_experience: number;
  skills_json: string;
  certifications_json: string;
  target_salary_min: number | null;
  preferred_work_mode: CandidateProfile["preferred_work_mode"];
  preferred_locations_json: string;
  resume_text: string;
  skill_match_overrides_json: string;
}

interface EvidenceRow {
  id: string;
  type: ProfileEvidence["type"];
  title: string;
  organization: string | null;
  period: string | null;
  description: string;
  claims_json: string;
}

interface D1QueryResult<T> {
  results: T[];
}

interface D1ReadableStatement extends D1PreparedStatementLike {
  bind(...values: unknown[]): D1ReadableStatement;
  all<T>(): Promise<D1QueryResult<T>>;
}

export interface D1ProfileDatabase extends D1DatabaseLike {
  prepare(query: string): D1ReadableStatement;
  batch(statements: D1PreparedStatementLike[]): Promise<unknown>;
}

function parseJsonList<T>(value: string): T[] {
  const parsed = JSON.parse(value) as unknown;
  return Array.isArray(parsed) ? parsed as T[] : [];
}

export async function loadProfileWithDatabase(database: D1ProfileDatabase, userId: string): Promise<CandidateProfile | null> {
  const row = await database.prepare(`
    SELECT full_name, current_title, primary_domain, years_experience, skills_json,
      certifications_json, target_salary_min, preferred_work_mode,
      preferred_locations_json, resume_text, skill_match_overrides_json
    FROM profiles WHERE user_id = ?
  `).bind(userId).first<ProfileRow>();

  if (!row) return null;

  const evidenceResult = await database.prepare(`
    SELECT id, type, title, organization, period, description, claims_json
    FROM profile_evidence WHERE user_id = ? ORDER BY id
  `).bind(userId).all<EvidenceRow>();

  return {
    full_name: row.full_name,
    current_title: row.current_title,
    primary_domain: row.primary_domain,
    years_experience: row.years_experience,
    skills: parseJsonList<string>(row.skills_json),
    certifications: parseJsonList<string>(row.certifications_json),
    target_salary_min: row.target_salary_min ?? undefined,
    preferred_work_mode: row.preferred_work_mode,
    preferred_locations: parseJsonList<string>(row.preferred_locations_json),
    resume_text: row.resume_text,
    evidence: evidenceResult.results.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      organization: item.organization ?? undefined,
      period: item.period ?? undefined,
      description: item.description,
      claims: parseJsonList<string>(item.claims_json),
    })),
    skill_match_overrides: parseJsonList<SkillMatchOverride>(row.skill_match_overrides_json),
  };
}

export async function saveProfileWithDatabase(
  database: D1ProfileDatabase,
  userId: string,
  profile: CandidateProfile,
  now = new Date().toISOString(),
): Promise<void> {
  const profileStatement = database.prepare(`
    INSERT INTO profiles (
      user_id, full_name, current_title, primary_domain, years_experience,
      skills_json, certifications_json, target_salary_min, preferred_work_mode,
      preferred_locations_json, resume_text, skill_match_overrides_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      full_name = excluded.full_name,
      current_title = excluded.current_title,
      primary_domain = excluded.primary_domain,
      years_experience = excluded.years_experience,
      skills_json = excluded.skills_json,
      certifications_json = excluded.certifications_json,
      target_salary_min = excluded.target_salary_min,
      preferred_work_mode = excluded.preferred_work_mode,
      preferred_locations_json = excluded.preferred_locations_json,
      resume_text = excluded.resume_text,
      skill_match_overrides_json = excluded.skill_match_overrides_json,
      updated_at = excluded.updated_at
  `).bind(
    userId,
    profile.full_name,
    profile.current_title,
    profile.primary_domain,
    profile.years_experience,
    JSON.stringify(profile.skills),
    JSON.stringify(profile.certifications),
    profile.target_salary_min ?? null,
    profile.preferred_work_mode,
    JSON.stringify(profile.preferred_locations ?? []),
    profile.resume_text,
    JSON.stringify(profile.skill_match_overrides ?? []),
    now,
    now,
  );

  const statements: D1PreparedStatementLike[] = [
    profileStatement,
    database.prepare("DELETE FROM profile_evidence WHERE user_id = ?").bind(userId),
    ...(profile.evidence ?? []).map((item) => database.prepare(`
      INSERT INTO profile_evidence (user_id, id, type, title, organization, period, description, claims_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      item.id,
      item.type,
      item.title,
      item.organization ?? null,
      item.period ?? null,
      item.description,
      JSON.stringify(item.claims),
    )),
  ];

  await database.batch(statements);
}
