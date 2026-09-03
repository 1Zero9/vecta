export const createUsersTableSql = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'User' CHECK (role IN ('User', 'Administrator')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL
  )
`;

export const createProfilesTableSql = `
  CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    current_title TEXT NOT NULL,
    primary_domain TEXT NOT NULL CHECK (primary_domain IN ('AI', 'Security', 'Governance', 'IT')),
    years_experience INTEGER NOT NULL CHECK (years_experience >= 0 AND years_experience <= 80),
    skills_json TEXT NOT NULL,
    certifications_json TEXT NOT NULL,
    target_salary_min INTEGER,
    preferred_work_mode TEXT NOT NULL CHECK (preferred_work_mode IN ('Remote', 'Hybrid', 'Onsite', 'Any')),
    preferred_locations_json TEXT NOT NULL,
    resume_text TEXT NOT NULL,
    skill_match_overrides_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`;

export const createProfileEvidenceTableSql = `
  CREATE TABLE IF NOT EXISTS profile_evidence (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Employment', 'Project', 'Certification')),
    title TEXT NOT NULL,
    organization TEXT,
    period TEXT,
    description TEXT NOT NULL,
    claims_json TEXT NOT NULL,
    PRIMARY KEY (user_id, id)
  )
`;
