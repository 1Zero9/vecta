import { z } from "zod";

const trimmedText = (maximum: number) => z.string().trim().max(maximum);
const nonEmptyText = (maximum: number) => trimmedText(maximum).min(1);
const stringList = (maximumItems: number, maximumLength: number) => z.array(nonEmptyText(maximumLength)).max(maximumItems);

const evidenceSchema = z.object({
  id: nonEmptyText(100),
  type: z.enum(["Employment", "Project", "Certification"]),
  title: nonEmptyText(200),
  organization: trimmedText(200).optional(),
  period: trimmedText(100).optional(),
  description: nonEmptyText(5000),
  claims: stringList(100, 200),
}).strict();

const skillMatchOverrideSchema = z.object({
  job_id: nonEmptyText(150),
  requirement: nonEmptyText(500),
  priority: z.enum(["required", "preferred"]),
  decision: z.enum(["include", "exclude"]),
}).strict();

export const candidateProfileSchema = z.object({
  full_name: nonEmptyText(200),
  current_title: trimmedText(300),
  primary_domain: z.enum(["AI", "Security", "Governance", "IT"]),
  years_experience: z.number().int().min(0).max(80),
  skills: stringList(200, 200),
  certifications: stringList(100, 300),
  target_salary_min: z.number().int().min(0).max(10_000_000).optional(),
  preferred_work_mode: z.enum(["Remote", "Hybrid", "Onsite", "Any"]),
  preferred_locations: stringList(100, 200).optional().default([]),
  resume_text: trimmedText(200_000),
  evidence: z.array(evidenceSchema).max(200).optional().default([]),
  skill_match_overrides: z.array(skillMatchOverrideSchema).max(1000).optional().default([]),
}).strict();

export function parseCandidateProfile(value: unknown) {
  return candidateProfileSchema.safeParse(value);
}
