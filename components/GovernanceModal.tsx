"use client";

import React, { useState } from "react";
import { wipeAllUserData, exportAllUserData } from "@/lib/storage";
import { APP_VERSION, EXPORT_SCHEMA_VERSION } from "@/lib/version";
import { SKILL_TAXONOMY_VERSION } from "@/lib/skillTaxonomy";
import confetti from "canvas-confetti";
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Info,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";

interface GovernanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataWiped: () => void;
}

export function GovernanceModal({
  isOpen,
  onClose,
  onDataWiped,
}: GovernanceModalProps) {
  const [activeSection, setActiveSection] = useState<"eu-ai" | "gdpr" | "iso" | "disclaimers">("eu-ai");
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [wipedSuccess, setWipedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleWipeData = () => {
    wipeAllUserData();
    setWipedSuccess(true);
    setTimeout(() => {
      setWipedSuccess(false);
      setShowWipeConfirm(false);
      onDataWiped();
      onClose();
    }, 1500);
  };

  const handleExportData = () => {
    const dataStr = exportAllUserData();
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vecta_user_data_export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
    });
  };

  return (
    <DialogShell
      titleId="governance-dialog-title"
      title="Governance and data controls"
      description="Prototype disclosures, local data rights, and the boundaries of Vecta's current deterministic features."
      icon={<Scale className="h-5 w-5" />}
      onClose={onClose}
      closeLabel="Close governance and data controls"
      size="lg"
      bodyClassName="p-0 sm:p-0"
      footer={(
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[11px] text-slate-500 font-mono">Vecta v{APP_VERSION} · Taxonomy v{SKILL_TAXONOMY_VERSION} · Export schema v{EXPORT_SCHEMA_VERSION}</div>
          <Button size="sm" onClick={onClose}>Close</Button>
        </div>
      )}
    >

        {/* Tab Navigation */}
        <div role="tablist" aria-label="Governance sections" className="flex items-center px-5 pt-4 sm:px-6 border-b border-slate-200 bg-slate-50 gap-4 overflow-x-auto">
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === "eu-ai"}
            onClick={() => setActiveSection("eu-ai")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 ${
              activeSection === "eu-ai"
                ? "border-cyan-400 text-sky-700"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI feature boundaries</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeSection === "gdpr"}
            onClick={() => setActiveSection("gdpr")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 ${
              activeSection === "gdpr"
                ? "border-emerald-400 text-emerald-700"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy controls</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeSection === "iso"}
            onClick={() => setActiveSection("iso")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 ${
              activeSection === "iso"
                ? "border-amber-400 text-amber-700"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Governance roadmap</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeSection === "disclaimers"}
            onClick={() => setActiveSection("disclaimers")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 ${
              activeSection === "disclaimers"
                ? "border-rose-400 text-rose-700"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Legal Disclaimers</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          
          {/* 1. EU AI Act Section */}
          {activeSection === "eu-ai" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-50 border border-cyan-500/30 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sky-700 text-sm">
                  <Sparkles className="w-4 h-4 text-sky-700" />
                  <span>Current AI feature boundary</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This preview does not call an external generative-AI model. It uses deterministic rules for fit estimates, résumé checks, and drafting templates. Any future AI service will need its own legal assessment, user notice, controls, and audit trail.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>User-reviewed drafting templates</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Cover-letter, résumé, and STAR outputs are local templates. Vecta does not submit applications. Users must replace bracketed prompts and verify every statement before use.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>No automated hiring decisions</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The current prototype does not use biometrics, emotion recognition, social scoring, candidate ranking for employers, or automated disqualification.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Explainable heuristic fit estimate</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Fit uses documented skill, experience, and discipline rules. It is a candidate decision aid, not an objective assessment or an employer hiring score.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. GDPR Privacy Section */}
          {activeSection === "gdpr" && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-700 text-sm">
                  <Lock className="w-4 h-4 text-emerald-700" />
                  <span>Prototype privacy controls</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Export and erase operate on the state stored by this browser prototype. They demonstrate intended product controls and do not establish production GDPR or UK GDPR compliance.
                </p>
              </div>

              {/* Data Minimization */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Data Minimization & Local-First Architecture
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your pipeline and saved items are stored in this browser. On the private hosted preview, a signed-in user can explicitly copy a reviewed profile, résumé text, evidence, preferences, and fit corrections to a protected D1 account. These controls do not yet export or erase that protected copy.
                </p>
              </div>

              {/* Interactive Data Subject Controls */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Interactive Data Rights Controls
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Article 20: Export Data */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 space-y-2">
                    <div className="font-bold text-slate-900 text-xs">
                      Download local data
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Download a machine-readable JSON copy of this browser’s profile, saved jobs, pipeline records, and consent history. It does not include a protected account copy.
                    </p>
                    <button
                      onClick={handleExportData}
                      className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-200"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Export All Data (JSON)</span>
                    </button>
                  </div>

                  {/* Article 17: Right to Erasure */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 space-y-2">
                    <div className="font-bold text-slate-900 text-xs text-rose-700">
                      Erase local Vecta data
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Delete this browser’s Vecta profile, résumé text, pipeline records, saved items, and privacy acknowledgement. A protected account copy is not deleted.
                    </p>
                    
                    {!showWipeConfirm ? (
                      <button
                        onClick={() => setShowWipeConfirm(true)}
                        className="w-full px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-rose-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Wipe All My Data</span>
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="text-[10px] text-rose-700 font-bold">
                          Are you sure? This cannot be undone.
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setShowWipeConfirm(false)}
                            className="flex-1 px-2 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleWipeData}
                            className="flex-1 px-2 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold"
                          >
                            {wipedSuccess ? "Wiped!" : "Confirm Wipe"}
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              </div>

            </div>
          )}

          {/* 3. ISO 42001 & AI Risk Section */}
          {activeSection === "iso" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-700 text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Governance is roadmap work</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Vecta is not certified to ISO/IEC 42001 and does not claim conformity. Production governance would require named ownership, risk records, monitoring, incident processes, supplier controls, and independent review.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="font-bold text-amber-700 block">Current deterministic boundary</span>
                  <p className="text-slate-400">
                    Current application aids use templates and profile evidence. Missing evidence produces explicit prompts instead of invented achievements or metrics.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="font-bold text-amber-700 block">Future service requirements</span>
                  <p className="text-slate-400">
                    Any future model-backed drafting needs provenance, model and prompt versions, user review, unsupported-claim checks, retention rules, and operational audit records.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. Legal Disclaimers Section */}
          {activeSection === "disclaimers" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Info className="w-4 h-4 text-rose-700" />
                  <span>Third-Party ATS & Employer Disclaimers</span>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  1. <strong>Independent Project</strong>: Vecta is an independent technological lookup tool and is not officially affiliated with, endorsed by, or sponsored by Greenhouse Software, AshbyHQ, Lever, Workable, SmartRecruiters, Pinpoint, or any employers featured in the directory.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  2. <strong>Demonstration links</strong>: The current catalogue is curated sample data and is not a verified live feed. External links are illustrative and must be checked before use.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  3. <strong>Compensation examples</strong>: Salary ranges and percentiles are curated demonstration values without a production source pipeline. They must not be treated as current market evidence.
                </p>
              </div>
            </div>
          )}

        </div>

    </DialogShell>
  );
}
