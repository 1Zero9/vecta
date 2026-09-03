import { env } from "cloudflare:workers";
import { loadPipelineWithDatabase, savePipelineWithDatabase, type D1PipelineDatabase } from "./d1PipelineStore";
import type { ApplicationTrack } from "./types";
export async function loadAuthenticatedPipeline(userId:string) { return loadPipelineWithDatabase(env.DB as unknown as D1PipelineDatabase,userId); }
export async function saveAuthenticatedPipeline(userId:string,pipeline:ApplicationTrack[]) { await savePipelineWithDatabase(env.DB as unknown as D1PipelineDatabase,userId,pipeline); }
