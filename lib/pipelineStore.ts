import type { ApplicationTrack } from "./types";
export async function loadAuthenticatedPipeline(_userId:string): Promise<ApplicationTrack[]|null> { return null; }
export async function saveAuthenticatedPipeline(_userId:string,_pipeline:ApplicationTrack[]): Promise<void> { throw new Error("Protected pipeline unavailable."); }
