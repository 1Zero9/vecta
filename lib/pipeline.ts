import { ApplicationTrack, Job } from "./types";

export interface AddJobToPipelineResult {
  pipeline: ApplicationTrack[];
  added: boolean;
}

export function addJobToPipeline(
  pipeline: ApplicationTrack[],
  job: Job,
  now: Date = new Date(),
): AddJobToPipelineResult {
  if (pipeline.some((application) => application.job_id === job.id)) {
    return { pipeline, added: false };
  }

  const date = now.toISOString().slice(0, 10);
  const application: ApplicationTrack = {
    id: `track-${job.id}-${now.getTime()}`,
    job_id: job.id,
    company_name: job.company_name,
    job_title: job.title,
    domain: job.domain,
    stage: "saved",
    date_added: date,
    date_updated: date,
    apply_url: job.apply_url,
    salary_target: job.salary_min ? `£${(job.salary_min / 1000).toFixed(0)}k` : undefined,
    notes: `Added from curated Jobs. Matching requirements: ${job.req_skills.slice(0, 3).join(", ")}.`,
  };

  return { pipeline: [application, ...pipeline], added: true };
}
