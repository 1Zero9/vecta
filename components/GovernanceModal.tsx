"use client";

import React, { useState } from "react";
import { wipeAllUserData, exportAllUserData } from "@/lib/storage";
import confetti from "canvas-confetti";
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  FileText, 
  Trash2, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Scale,
  RefreshCw,
  ExternalLink
} from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm transition-all">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white font-black shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>Vecta Governance & Compliance Charter</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                  EU AI Act & GDPR
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ethical AI disclosures, data subject rights, and regulatory transparency.
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

        {/* Tab Navigation */}
        <div className="flex items-center px-6 pt-4 border-b border-slate-200 bg-slate-50 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSection("eu-ai")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 ${
              activeSection === "eu-ai"
                ? "border-cyan-400 text-sky-700"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>EU AI Act Disclosure</span>
          </button>

          <button
            onClick={() => setActiveSection("gdpr")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 ${
              activeSection === "gdpr"
                ? "border-emerald-400 text-emerald-700"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>GDPR & Privacy Rights</span>
          </button>

          <button
            onClick={() => setActiveSection("iso")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 ${
              activeSection === "iso"
                ? "border-amber-400 text-amber-700"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ISO 42001 & AI Risk</span>
          </button>

          <button
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
          
          {/* 1. EU AI Act Section */}
          {activeSection === "eu-ai" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-50 border border-cyan-500/30 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sky-700 text-sm">
                  <Sparkles className="w-4 h-4 text-sky-700" />
                  <span>EU AI Act Article 50 & 52 Transparency Statement</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Vecta operates as an intelligent career navigator and drafting assistant. Under the European Union Artificial Intelligence Act (EU AI Act, Regulation (EU) 2024/1689), we disclose our algorithmic models and compliance guardrails.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Human-in-the-Loop Assistive Model (Non-Autonomous)</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    All tailored cover letters, resume highlights, and STAR interview packs generated by Vecta are advisory drafts. No automated applications are submitted to prospective employers without explicit human review and authorization.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>No Prohibited or High-Risk Biometric Profiling</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Vecta strictly prohibits and does not implement emotion recognition, biometric categorization, social credit scoring, or automated candidate disqualification systems.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Objective Vector Distance Scoring</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Our fit evaluation uses transparent heuristic keyword alignment and domain overlap metrics rather than opaque black-box scoring.
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
                  <span>GDPR Compliance & Data Subject Rights (EU / UK GDPR)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In compliance with the General Data Protection Regulation (Regulation (EU) 2016/679 and UK Data Protection Act 2018), you have absolute sovereignty over your candidate profile and telemetry data.
                </p>
              </div>

              {/* Data Minimization */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Data Minimization & Local-First Architecture
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your resume text and candidate profile are stored locally in your browser session or securely within your isolated Prisma database account. We do not sell, broker, or monetize your career data to third-party recruiters or advertising networks.
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
                      Article 20: Right to Data Portability
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Download a complete machine-readable JSON copy of your profile, saved jobs, pipeline records, and consent history.
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
                      Article 17: Right to Erasure (Wipe Data)
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Permanently delete your profile, customized resume text, pipeline records, and local session tokens with 1 click.
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
                  <span>ISO/IEC 42001 AI Management System (AIMS) Alignment</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Vecta aligns with ISO/IEC 42001 governance controls to ensure continuous risk monitoring, algorithmic accuracy, and prompt safety.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="font-bold text-amber-700 block">Hallucination Mitigation</span>
                  <p className="text-slate-400">
                    Generative prompts are bounded to the exact text extracted from the candidate's input and job specification, preventing fabricated credentials.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="font-bold text-amber-700 block">Auditability & Model Cards</span>
                  <p className="text-slate-400">
                    Every generation outputs structured STAR and Google XYZ formats that can be cross-verified and version-controlled by the user.
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
                  2. <strong>Direct Portal Submission</strong>: Vecta provides deep links to verified public ATS portals. The submission of job applications, background checks, and hiring determinations are solely governed by the respective hiring organization’s terms and privacy policies.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  3. <strong>Compensation Benchmarks</strong>: Salary ranges and percentiles displayed on Vecta are statistical market estimates based on aggregated industry surveys and public postings. They are intended for guidance and negotiation benchmarking only.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Vecta Governance Suite v2.4 • Compliant with EU AI Act & GDPR
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
