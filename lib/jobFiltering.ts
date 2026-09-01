import { DomainType, Job, WorkMode } from "./types";

export interface JobFilterOptions {
  activeDomain: DomainType | "ALL";
  seniority: string | "ALL";
  workMode: WorkMode | "ALL";
  savedOnly: boolean;
  savedJobIds: string[];
  query: string;
}

export function filterJobs(jobs: Job[], options: JobFilterOptions): Job[] {
  const query = options.query.trim().toLowerCase();

  return jobs.filter((job) => {
    if (options.activeDomain !== "ALL" && job.domain !== options.activeDomain) return false;
    if (options.seniority !== "ALL" && !job.seniority.includes(options.seniority)) return false;
    if (options.workMode !== "ALL" && job.work_mode !== options.workMode) return false;
    if (options.savedOnly && !options.savedJobIds.includes(job.id)) return false;
    if (!query) return true;

    return [job.title, job.company_name, job.summary, ...job.req_skills, ...(job.governance_standards ?? [])]
      .some((value) => value.toLowerCase().includes(query));
  });
}
