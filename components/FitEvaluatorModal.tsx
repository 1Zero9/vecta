"use client";

import React from "react";
import { Job, CandidateProfile } from "@/lib/types";
import { evaluateVectorFit } from "@/lib/fitEngine";
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Zap, 
  FileText, 
  Award,
  ArrowRight,
  TrendingUp
} from "lucide-react";

interface FitEvaluatorModalProps {
  job: Job | null;
  profile: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenCopilot: (job: Job, mode: "tailor" | "interview") => void;
}

export function FitEvaluatorModal({
  job,
  profile,
  isOpen,
  onClose,
  onOpenCopilot,
}: FitEvaluatorModalProps) {
  if (!isOpen || !job) return null;

  const fit = evaluateVectorFit(profile, job);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm transition-all">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white font-black shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Vector Match & ATS Parseability Audit
              </h3>
              <p className="text-xs text-slate-400 font-medium truncate max-w-md">
                {job.title} // {job.company_name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Top Score Matrix Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            
            {/* Overall Score */}
            <div className="text-center sm:border-r border-slate-200 sm:pr-4 py-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Overall Vector Fit
              </div>
              <div className={`text-3xl sm:text-4xl font-black font-mono mt-1 ${
                fit.overall_score >= 80 ? "text-emerald-700" : fit.overall_score >= 60 ? "text-amber-700" : "text-rose-700"
              }`}>
                {fit.overall_score}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Weighted Readiness</div>
            </div>

            {/* Skills Match */}
            <div className="text-center py-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Skills Alignment</div>
              <div className="text-2xl font-bold font-mono text-sky-700 mt-1">
                {fit.skills_score}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">50% Weight</div>
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

          {/* Skills Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Matching Skills */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700 text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Matching Skills ({fit.matching_skills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {fit.matching_skills.length > 0 ? (
                  fit.matching_skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-700 font-medium text-xs border border-emerald-500/30"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-xs italic">No exact skill matches identified.</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200/70 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-400 text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Skill Gaps ({fit.missing_skills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {fit.missing_skills.length > 0 ? (
                  fit.missing_skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-400 font-medium text-xs border border-slate-700"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-emerald-700 text-xs font-semibold">Full skill coverage achieved!</span>
                )}
              </div>
            </div>

          </div>

          {/* AI Bridge Answers for Interviewing */}
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
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      "{bridge.talking_point}"
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

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
          >
            Close Audit
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenCopilot(job, "interview");
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-700" />
              <span>STAR Interview Pack</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenCopilot(job, "tailor");
              }}
              className="px-5 py-2.5 bg-[#2563EB] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all hover:bg-[#1D4ED8]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Tailored Application</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
