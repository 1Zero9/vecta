import { NextResponse } from "next/server";
import companiesData from "@/data/companies.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");
  const scale = searchParams.get("scale");
  const search = searchParams.get("search")?.toLowerCase().trim();

  let results = [...companiesData];

  if (domain && domain !== "ALL") {
    results = results.filter((c) => c.domain.toLowerCase() === domain.toLowerCase());
  }

  if (scale && scale !== "ALL") {
    results = results.filter((c) => c.scale_tier.toLowerCase().includes(scale.toLowerCase()));
  }

  if (search) {
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.tagline.toLowerCase().includes(search) ||
        c.tech_stack.some((t) => t.toLowerCase().includes(search)) ||
        c.compliance_tags.some((comp) => comp.toLowerCase().includes(search))
    );
  }

  return NextResponse.json(results);
}
