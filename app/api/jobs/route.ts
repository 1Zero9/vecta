import { NextResponse } from "next/server";
import jobsData from "@/data/jobs.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");
  const seniority = searchParams.get("seniority");
  const workMode = searchParams.get("workMode");
  const search = searchParams.get("search")?.toLowerCase().trim();

  let results = [...jobsData];

  if (domain && domain !== "ALL") {
    results = results.filter((j) => j.domain.toLowerCase() === domain.toLowerCase());
  }

  if (seniority && seniority !== "ALL") {
    results = results.filter((j) => j.seniority.toLowerCase().includes(seniority.toLowerCase()));
  }

  if (workMode && workMode !== "ALL") {
    results = results.filter((j) => j.work_mode.toLowerCase() === workMode.toLowerCase());
  }

  if (search) {
    results = results.filter(
      (j) =>
        j.title.toLowerCase().includes(search) ||
        j.company_name.toLowerCase().includes(search) ||
        j.req_skills.some((s) => s.toLowerCase().includes(search)) ||
        j.summary.toLowerCase().includes(search)
    );
  }

  return NextResponse.json(results);
}
