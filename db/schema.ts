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

export const createSavedItemSetsTableSql = `
  CREATE TABLE IF NOT EXISTS saved_item_sets (
    user_id TEXT PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`;

export const createSavedJobsTableSql = `
  CREATE TABLE IF NOT EXISTS saved_jobs (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, job_id)
  )
`;

export const createFavouriteCompaniesTableSql = `
  CREATE TABLE IF NOT EXISTS favourite_companies (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, company_id)
  )
`;

export const createPipelineSetsTableSql = `
  CREATE TABLE IF NOT EXISTS pipeline_sets (
    user_id TEXT PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`;

export const createApplicationsTableSql = `
  CREATE TABLE IF NOT EXISTS applications (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    id TEXT NOT NULL,
    job_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    domain TEXT NOT NULL CHECK (domain IN ('AI', 'Security', 'Governance', 'IT')),
    stage TEXT NOT NULL CHECK (stage IN ('saved', 'drafting', 'applied', 'screening', 'interviewing', 'offer', 'archived')),
    date_added TEXT NOT NULL,
    date_updated TEXT NOT NULL,
    apply_url TEXT,
    notes TEXT,
    tailored_bullets_json TEXT NOT NULL,
    interview_dates_json TEXT NOT NULL,
    salary_target TEXT,
    activity_json TEXT NOT NULL,
    PRIMARY KEY (user_id, id)
  )
`;
