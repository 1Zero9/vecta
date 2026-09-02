"use client";

import React from "react";
import { Job, CandidateProfile, SkillMatchDecision } from "@/lib/types";
import { evaluateVectorFit } from "@/lib/fitEngine";
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  FileText, 
  ShieldCheck,
  CircleDashed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";

interface FitEvaluatorModalProps {
  job: Job | null;
  profile: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenCopilot: (job: Job, mode: "tailor" | "interview") => void;
  onOpenProfile: () => void;
  onUpdateSkillMatchOverride: (
    jobId: string,
    requirement: string,
    priority: "required" | "preferred",
    decision: SkillMatchDecision | null,
  ) => void;
}

export function FitEvaluatorModal({
  job,
  profile,
  isOpen,
  onClose,
  onOpenCopilot,
  onOpenProfile,
  onUpdateSkillMatchOverride,
}: FitEvaluatorModalProps) {
  if (!isOpen || !job) return null;

  const fit = evaluateVectorFit(profile, job);

  return (
    <DialogShell
      titleId="fit-audit-title"
      title="Vector Match and résumé audit"
      description={`${job.title} · ${job.company_name}`}
      icon={<Sparkles className="h-5 w-5" />}
      onClose={onClose}
      closeLabel="Close fit audit"
      size="lg"
      bodyClassName="p-0 sm:p-0"
      footer={(
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button onClick={onClose}>Close audit</Button>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => { onClose(); onOpenCopilot(job, "interview"); }}>
              <Zap className="h-4 w-4 text-amber-700" /> STAR interview pack
            </Button>
            <Button variant="primary" onClick={() => { onClose(); onOpenCopilot(job, "tailor"); }}>
              <FileText className="h-4 w-4" /> Prepare application draft
            </Button>
          </div>
        </div>
      )}
    >

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Top Score Matrix Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            
            {/* Overall Score */}
            <div className="text-center sm:border-r border-slate-200 sm:pr-4 py-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                {fit.confidence_level === "Low" ? "Directional Fit" : "Overall Vector Fit"}
              </div>
              <div className={`text-3xl sm:text-4xl font-black font-mono mt-1 ${
                fit.overall_score >= 80 ? "text-emerald-700" : fit.overall_score >= 60 ? "text-amber-700" : "text-rose-700"
              }`}>
                {fit.confidence_level === "Low" ? "—" : `${fit.overall_score}%`}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{fit.confidence_level === "Low" ? "Insufficient information" : "Weighted readiness"}</div>
            </div>

            {/* Skills Match */}
            <div className="text-center py-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Skills Alignment</div>
              <div className="text-2xl font-bold font-mono text-sky-700 mt-1">
                {fit.skills_score}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">50% overall weight</div>
            </div>

            {/* Seniority Match */}
            <div className="text-center py-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Seniority Caliber</div>
              <div className="text-2xl font-bold font-mono text-indigo-700 mt-1">
                {fit.seniority_score}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">25% Weight</div>
            </div>

            {/* Domain Match */}
            <div className="text-center py-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Domain Synergy</div>
              <div className="text-2xl font-bold font-mono text-amber-700 mt-1">
                {fit.domain_score}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">25% Weight</div>
            </div>

          </div>

          <section className={`rounded-2xl border p-4 ${
            fit.confidence_level === "High"
              ? "border-emerald-100 bg-emerald-50"
              : fit.confidence_level === "Moderate"
                ? "border-blue-100 bg-blue-50"
                : "border-amber-200 bg-amber-50"
          }`} aria-labelledby="fit-confidence-heading">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-2.5">
                {fit.confidence_level === "Low" ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" /> : <ShieldCheck className={`mt-0.5 h-4 w-4 shrink-0 ${fit.confidence_level === "High" ? "text-emerald-700" : "text-blue-700"}`} />}
                <div>
                  <h4 id="fit-confidence-heading" className="text-xs font-semibold text-slate-900">
                    {fit.confidence_level === "Low" ? "Insufficient information for a reliable score" : `${fit.confidence_level} confidence in this estimate`}
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-4 text-slate-600">Confidence reflects the amount of usable profile detail, job requirements, and linked evidence—not how strong the match is.</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-black/5">{fit.confidence_score}/100 confidence</span>
            </div>

            {(fit.confidence_reasons.length > 0 || fit.confidence_limitations.length > 0) && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {fit.confidence_reasons.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">What supports it</p>
                    <ul className="mt-1.5 space-y-1 text-[10px] leading-4 text-slate-600">
                      {fit.confidence_reasons.slice(0, 3).map((reason) => <li key={reason} className="flex items-start gap-1.5"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-700" />{reason}</li>)}
                    </ul>
                  </div>
                )}
                {fit.confidence_limitations.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Current limitations</p>
                    <ul className="mt-1.5 space-y-1 text-[10px] leading-4 text-slate-600">
                      {fit.confidence_limitations.slice(0, 3).map((limitation) => <li key={limitation} className="flex items-start gap-1.5"><CircleDashed className="mt-0.5 h-3 w-3 shrink-0 text-amber-700" />{limitation}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {fit.confidence_level === "Low" && (
              <button type="button" onClick={() => { onClose(); onOpenProfile(); }} className="mt-3 rounded-lg bg-amber-700 px-3 py-2 text-[11px] font-semibold text-white hover:bg-amber-800">Complete profile details</button>
            )}
          </section>

          {/* Skills Breakdown */}
          <section className="space-y-3" aria-labelledby="fit-skills-heading">
            <div>
              <h4 id="fit-skills-heading" className="text-sm font-semibold text-slate-900">Required and preferred skill coverage</h4>
              <p className="mt-0.5 text-[11px] leading-4 text-slate-500">Required skills contribute 75% of skills alignment; preferred skills contribute 25%. Taxonomy v{fit.taxonomy_version} shows recognised aliases and their source, and you can correct the result.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Required skills",
                  weight: "75% of skills alignment",
                  score: fit.required_skills_score,
                  matched: fit.matching_required_skills,
                  missing: fit.missing_required_skills,
                  priority: "required" as const,
                },
                {
                  title: "Preferred skills",
                  weight: "25% of skills alignment",
                  score: fit.preferred_skills_score,
                  matched: fit.matching_preferred_skills,
                  missing: fit.missing_preferred_skills,
                  priority: "preferred" as const,
                },
              ].map((group) => (
                <article key={group.priority} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h5 className="text-xs font-semibold text-slate-800">{group.title}</h5>
                      <p className="mt-0.5 text-[10px] text-slate-500">{group.weight}</p>
                    </div>
                    <span className="rounded-lg bg-white px-2 py-1 font-mono text-xs font-semibold text-slate-700 ring-1 ring-slate-200">{group.score}%</span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700">Matched · {group.matched.length}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {group.matched.length > 0 ? group.matched.map((skill) => {
                          const detail = fit.skill_matches.find((match) => match.priority === group.priority && match.requirement === skill);
                          return (
                            <span key={skill} className="rounded-lg border border-emerald-200 bg-white px-2 py-1.5 text-[10px] font-medium text-emerald-800">
                              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />{skill}</span>
                              {detail?.matchedBy && detail.matchedBy !== skill && (
                                <span className="mt-0.5 block text-[9px] font-normal text-emerald-700/75">{detail.matchedBy === "User correction" ? "Included by you" : `via ${detail.matchedBy === "Résumé text" ? "résumé" : detail.matchedBy}`}</span>
                              )}
                              <button
                                type="button"
                                onClick={() => onUpdateSkillMatchOverride(job.id, skill, group.priority, detail?.userDecision ? null : "exclude")}
                                className="mt-1.5 block rounded-md bg-slate-50 px-1.5 py-1 text-[9px] font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                aria-label={`${detail?.userDecision ? "Undo correction for" : "Exclude"} ${skill}`}
                              >
                                {detail?.userDecision ? "Undo correction" : "Not a match"}
                              </button>
                            </span>
                          );
                        }) : <span className="text-[10px] italic text-slate-500">No matches yet.</span>}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-700">Gaps · {group.missing.length}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {group.missing.length > 0
                          ? group.missing.map((skill) => {
                            const detail = fit.skill_matches.find((match) => match.priority === group.priority && match.requirement === skill);
                            return (
                              <span key={skill} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-medium text-slate-600">
                                <span className="block">{skill}</span>
                                {detail?.userDecision === "exclude" && <span className="mt-0.5 block text-[9px] font-normal text-amber-700">Excluded by you</span>}
                                <button
                                  type="button"
                                  onClick={() => onUpdateSkillMatchOverride(job.id, skill, group.priority, detail?.userDecision ? null : "include")}
                                  className="mt-1.5 block rounded-md bg-blue-50 px-1.5 py-1 text-[9px] font-semibold text-blue-700 hover:bg-blue-100"
                                  aria-label={`${detail?.userDecision ? "Undo correction for" : "Count as match"} ${skill}`}
                                >
                                  {detail?.userDecision ? "Undo correction" : "Count as match"}
                                </button>
                              </span>
                            );
                          })
                          : <span className="text-[10px] font-medium text-emerald-700">Full coverage.</span>}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Evidence Coverage */}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5" aria-labelledby="fit-evidence-heading">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h4 id="fit-evidence-heading" className="text-sm font-semibold text-slate-900">Evidence behind this match</h4>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">Linked sources explain which matched claims you can support in an application or interview.</p>
                </div>
              </div>
              <div className="shrink-0 text-left sm:text-right">
                <p className="text-lg font-semibold text-slate-900">{fit.evidence_coverage_score}%</p>
                <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">Evidence coverage</p>
              </div>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${fit.evidence_coverage_score}%` }} />
            </div>

            {fit.evidence_matches.length > 0 && (
              <div className="space-y-2">
                {fit.evidence_matches.map((match) => (
                  <article key={match.claim} className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{match.claim}</span>
                    </div>
                    <div className="mt-2 space-y-1.5">
                      {match.evidence.map((evidence) => (
                        <div key={evidence.id} className="rounded-lg bg-white/80 px-3 py-2 ring-1 ring-emerald-100">
                          <p className="text-[11px] font-semibold text-slate-800">{evidence.title}</p>
                          <p className="mt-0.5 text-[10px] text-slate-500">{[evidence.type, evidence.organization, evidence.period].filter(Boolean).join(" · ")}</p>
                          <p className="mt-1 text-[11px] leading-4 text-slate-600">{evidence.description}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {fit.unsupported_matches.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                <div className="flex items-start gap-2">
                  <CircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-amber-900">Matched, but not yet linked to evidence</p>
                    <p className="mt-0.5 text-[11px] leading-4 text-amber-800/80">These claims still contribute to fit because they appear in your profile or résumé. Add a source before relying on them in an application.</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {fit.unsupported_matches.map((claim) => <span key={claim} className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-amber-800 ring-1 ring-amber-200">{claim}</span>)}
                    </div>
                    <button type="button" onClick={() => { onClose(); onOpenProfile(); }} className="mt-3 rounded-lg bg-amber-700 px-3 py-2 text-[11px] font-semibold text-white hover:bg-amber-800">
                      Add supporting evidence
                    </button>
                  </div>
                </div>
              </div>
            )}

            {fit.evidence_matches.length === 0 && fit.unsupported_matches.length === 0 && (
              <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">No matching claims are available to evidence for this role yet.</p>
            )}
          </section>

          {/* Bridge Answers for Interviewing */}
          {fit.suggested_bridge_answers.length > 0 && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-amber-700 text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-700" />
                <span>Recommended Bridge Talking Points for Gaps</span>
              </div>
              <div className="space-y-2">
                {fit.suggested_bridge_answers.map((bridge, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200/70 space-y-1">
                    <div className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>Addressing: {bridge.gap}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      “{bridge.talking_point}”
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ATS Parseability Audit */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                ATS Engine Parseability Score
              </div>
              <div className="font-mono font-bold text-sky-700">
                {fit.ats_parseability_score}/100
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                style={{ width: `${fit.ats_parseability_score}%` }}
              ></div>
            </div>
            <ul className="space-y-1 pt-1 text-xs text-slate-400">
              {fit.ats_feedback.map((fb, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-sky-700">•</span>
                  <span>{fb}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

    </DialogShell>
  );
}
