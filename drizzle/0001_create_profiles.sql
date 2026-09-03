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
);
--> statement-breakpoint
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
);
