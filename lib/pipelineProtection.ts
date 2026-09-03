import { z } from "zod";
import type { ApplicationTrack } from "./types";
import type { ProfileProtectionState } from "./profileProtection";

export type PipelineProtectionState = ProfileProtectionState;

const text = (max: number) => z.string().trim().max(max);
const required = (max: number) => text(max).min(1);
const activity = z.object({
  id: required(150),
  type: z.enum(["created", "stage_changed", "notes_updated"]),
  description: required(1000),
  occurred_at: required(50),
}).strict();

export const pipelineSchema = z.array(z.object({
  id: required(150), job_id: required(150), company_name: required(300), job_title: required(300),
  domain: z.enum(["AI", "Security", "Governance", "IT"]),
  stage: z.enum(["saved", "drafting", "applied", "screening", "interviewing", "offer", "archived"]),
  date_added: required(50), date_updated: required(50), apply_url: text(2000).optional(), notes: text(20000).optional(),
  tailored_bullets: z.array(required(2000)).max(100).optional(), interview_dates: z.array(required(100)).max(100).optional(),
  salary_target: text(200).optional(), activity: z.array(activity).max(1000).optional().default([]),
}).strict()).max(2000);

export function parsePipeline(value: unknown) { return pipelineSchema.safeParse(value); }

export function pipelinesAreEquivalent(left: ApplicationTrack[], right: ApplicationTrack[]) {
  const canonical = (items: ApplicationTrack[]) => [...items].map((item) => ({ ...item, activity: item.activity ?? [] }))
    .sort((a, b) => a.id.localeCompare(b.id));
  return JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));
}
