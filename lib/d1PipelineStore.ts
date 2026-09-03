import type { D1DatabaseLike, D1PreparedStatementLike } from "./d1AccountStore";
import type { ApplicationTrack } from "./types";

interface Statement extends D1PreparedStatementLike { bind(...values: unknown[]): Statement; all<T>(): Promise<{ results: T[] }>; }
export interface D1PipelineDatabase extends D1DatabaseLike { prepare(query: string): Statement; batch(statements: D1PreparedStatementLike[]): Promise<unknown>; }

interface Row { id:string; job_id:string; company_name:string; job_title:string; domain:ApplicationTrack["domain"]; stage:ApplicationTrack["stage"]; date_added:string; date_updated:string; apply_url:string|null; notes:string|null; tailored_bullets_json:string; interview_dates_json:string; salary_target:string|null; activity_json:string; }
const list = <T>(value: string): T[] => { const parsed = JSON.parse(value) as unknown; return Array.isArray(parsed) ? parsed as T[] : []; };

export async function loadPipelineWithDatabase(db: D1PipelineDatabase, userId: string): Promise<ApplicationTrack[] | null> {
  const marker = await db.prepare("SELECT user_id FROM pipeline_sets WHERE user_id = ?").bind(userId).first<{user_id:string}>();
  if (!marker) return null;
  const rows = await db.prepare("SELECT * FROM applications WHERE user_id = ? ORDER BY date_updated DESC, id").bind(userId).all<Row>();
  return rows.results.map((row) => ({ id:row.id, job_id:row.job_id, company_name:row.company_name, job_title:row.job_title, domain:row.domain, stage:row.stage, date_added:row.date_added, date_updated:row.date_updated, apply_url:row.apply_url ?? undefined, notes:row.notes ?? undefined, tailored_bullets:list<string>(row.tailored_bullets_json), interview_dates:list<string>(row.interview_dates_json), salary_target:row.salary_target ?? undefined, activity:list(row.activity_json) }));
}

export async function savePipelineWithDatabase(db: D1PipelineDatabase, userId: string, pipeline: ApplicationTrack[], now = new Date().toISOString()) {
  const statements: D1PreparedStatementLike[] = [
    db.prepare("INSERT INTO pipeline_sets (user_id, created_at, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET updated_at = excluded.updated_at").bind(userId, now, now),
    db.prepare("DELETE FROM applications WHERE user_id = ?").bind(userId),
    ...pipeline.map((item) => db.prepare(`INSERT INTO applications (user_id,id,job_id,company_name,job_title,domain,stage,date_added,date_updated,apply_url,notes,tailored_bullets_json,interview_dates_json,salary_target,activity_json) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(userId,item.id,item.job_id,item.company_name,item.job_title,item.domain,item.stage,item.date_added,item.date_updated,item.apply_url??null,item.notes??null,JSON.stringify(item.tailored_bullets??[]),JSON.stringify(item.interview_dates??[]),item.salary_target??null,JSON.stringify(item.activity??[]))),
  ];
  await db.batch(statements);
}
