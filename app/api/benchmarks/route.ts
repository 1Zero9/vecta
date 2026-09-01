import { NextResponse } from "next/server";
import salaryBenchmarksData from "@/data/salaryBenchmarks.json";
import talentArchetypesData from "@/data/talentArchetypes.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  let benchmarks = [...salaryBenchmarksData];
  let archetypes = [...talentArchetypesData];

  if (domain && domain !== "ALL") {
    benchmarks = benchmarks.filter((b) => b.domain.toLowerCase() === domain.toLowerCase());
    archetypes = archetypes.filter((a) => a.domain.toLowerCase() === domain.toLowerCase());
  }

  return NextResponse.json({
    benchmarks,
    archetypes,
  });
}
