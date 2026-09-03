import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/pipeline/route";
import { parsePipeline, pipelinesAreEquivalent } from "@/lib/pipelineProtection";
import type { ApplicationTrack } from "@/lib/types";

const application: ApplicationTrack = { id:"track-1", job_id:"job-1", company_name:"Vecta", job_title:"Engineer", domain:"IT", stage:"saved", date_added:"2026-09-03", date_updated:"2026-09-03", notes:"Review", activity:[] };

describe("protected pipeline",()=>{
  it("accepts a complete pipeline and detects changes",()=>{ expect(parsePipeline([application]).success).toBe(true); expect(pipelinesAreEquivalent([application],[{...application,stage:"applied"}])).toBe(false); });
  it("rejects ownership fields",()=>{ expect(parsePipeline([{...application,user_id:"other"}]).success).toBe(false); });
  it("rejects unauthenticated reads",async()=>{const response=await GET(new Request("https://vecta.test/api/pipeline"));expect(response.status).toBe(401);});
});
