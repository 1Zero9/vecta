import { describe, expect, it } from "vitest";
import { loadPipelineWithDatabase, savePipelineWithDatabase, type D1PipelineDatabase } from "@/lib/d1PipelineStore";
import type { ApplicationTrack } from "@/lib/types";

function fake(hasMarker=true){const captures:{query:string;values:unknown[];statement?:object}[]=[];let batch:typeof captures=[];const db={prepare(query:string){const c={query,values:[]} as (typeof captures)[number];captures.push(c);const s={bind(...values:unknown[]){c.values=values;return s;},async first<T>(){return(hasMarker?{user_id:"owner"}:null) as T|null;},async all<T>(){return{results:[] as T[]};}};c.statement=s;return s;},async batch(items:object[]){batch=items.map(item=>captures.find(c=>c.statement===item)!).filter(Boolean);}};return{db:db as unknown as D1PipelineDatabase,captures,getBatch:()=>batch};}
const app:ApplicationTrack={id:"track-1",job_id:"job-1",company_name:"Vecta",job_title:"Engineer",domain:"IT",stage:"saved",date_added:"2026-09-03",date_updated:"2026-09-03",activity:[]};
describe("D1 pipeline store",()=>{
  it("preserves an intentional empty pipeline under the authenticated owner",async()=>{const f=fake();await savePipelineWithDatabase(f.db,"owner",[]);expect(f.getBatch()).toHaveLength(2);expect(f.getBatch().every(x=>x.values[0]==="owner")).toBe(true);});
  it("distinguishes no migration from an empty protected pipeline",async()=>{const f=fake(false);await expect(loadPipelineWithDatabase(f.db,"owner")).resolves.toBeNull();expect(f.captures).toHaveLength(1);});
  it("binds application writes to the authenticated owner",async()=>{const f=fake();await savePipelineWithDatabase(f.db,"owner",[app]);expect(f.getBatch()).toHaveLength(3);expect(f.getBatch().every(x=>x.values[0]==="owner")).toBe(true);});
});
