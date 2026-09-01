export type DomainType = "AI" | "Security" | "Governance" | "IT";

export type ScaleTier = "Startup (1-20)" | "Scaleup (20-100)" | "Mid-Market (100-500)" | "Enterprise / FDI (500+)";

export type WorkMode = "Remote" | "Hybrid" | "Onsite";

export type SeniorityLevel = "Junior / Associate" | "Mid-Level" | "Senior" | "Lead / Staff" | "Director / VP / C-Level";

export type AtsType = 
  | "greenhouse" 
  | "ashby" 
  | "lever" 
  | "workable" 
  | "smartrecruiters" 
  | "pinpoint" 
  | "teamtailor" 
  | "bamboohr" 
  | "custom";

export type ApplicationStage = 
  | "saved" 
  | "drafting" 
  | "applied" 
  | "screening" 
  | "interviewing" 
  | "offer" 
  | "archived";

export interface Company {
  id: string;
  name: string;
  tagline: string;
  domain: DomainType;
  subdomains: string[];
  scale_tier: ScaleTier;
  location: string;
  work_mode: WorkMode;
  website: string;
  careers_url: string;
  ats_type: AtsType;
  funding: "Bootstrapped" | "VC-backed" | "PE-backed" | "Public / Corporate";
  compliance_tags: string[]; // e.g. "ISO 27001", "SOC 2 Type II", "EU AI Act Ready", "NIS2", "HIPAA"
  tech_stack: string[];
  open_roles_count: number;
  featured?: boolean;
  hiring_velocity: "Very High" | "High" | "Moderate" | "Selective";
  leadership: string[];
  description: string;
  last_checked: string;
}

export interface Job {
  id: string;
  company_id: string;
  company_name: string;
  title: string;
  domain: DomainType;
  subdomain: string;
  seniority: SeniorityLevel;
  location: string;
  work_mode: WorkMode;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  posted_date: string;
  ats_type: AtsType;
  apply_url: string;
  req_skills: string[];
  preferred_skills: string[];
  certifications?: string[];
  governance_standards?: string[];
  summary: string;
  key_responsibilities: string[];
  requirements: string[];
  featured?: boolean;
}

export interface SalaryBenchmark {
  id: string;
  domain: DomainType;
  role_title: string;
  seniority: SeniorityLevel;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  currency: string;
  market_trend: "+12% YoY" | "+8% YoY" | "+15% YoY" | "+5% YoY";
  sample_size: number;
  top_demanded_skills: string[];
  primary_certifications: string[];
}

export interface TalentArchetype {
  id: string;
  title: string;
  domain: DomainType;
  typical_seniority: SeniorityLevel;
  key_deliverables: string[];
  standard_skills: string[];
  key_certifications: string[];
  interview_question_samples: string[];
  average_salary_range: string;
}

export interface ApplicationTrack {
  id: string;
  job_id: string;
  company_name: string;
  job_title: string;
  domain: DomainType;
  stage: ApplicationStage;
  date_added: string;
  date_updated: string;
  apply_url?: string;
  notes?: string;
  tailored_bullets?: string[];
  interview_dates?: string[];
  salary_target?: string;
}

export interface CandidateProfile {
  full_name: string;
  current_title: string;
  primary_domain: DomainType;
  years_experience: number;
  skills: string[];
  certifications: string[];
  target_salary_min?: number;
  preferred_work_mode: WorkMode | "Any";
  resume_text: string;
}

export interface VectorMatchResult {
  overall_score: number; // 0 - 100
  skills_score: number;
  seniority_score: number;
  domain_score: number;
  matching_skills: string[];
  missing_skills: string[];
  matching_certs: string[];
  missing_certs: string[];
  suggested_bridge_answers: { gap: string; talking_point: string }[];
  ats_parseability_score: number;
  ats_feedback: string[];
}

export interface StarQuestionPack {
  question: string;
  category: "Technical / Domain" | "Incident / Crisis" | "Leadership / Governance" | "Problem Solving";
  situation: string;
  task: string;
  action: string;
  result: string;
  pro_tip: string;
}
