CREATE TABLE IF NOT EXISTS pipeline_sets (
  user_id TEXT PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
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
);
