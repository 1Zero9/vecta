"use client";

import React, { useState } from "react";
import { UserAccount, CandidateProfile } from "@/lib/types";
import { DEMO_PERSONAS } from "@/lib/storage";
import { 
  X, 
  UserCheck, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Database, 
  RefreshCw, 
  LogOut, 
  UserPlus,
  Lock,
  ArrowRight
} from "lucide-react";

interface UserManagementModalProps {
  currentUser: UserAccount;
  isOpen: boolean;
  onClose: () => void;
  onSelectPersona: (personaKey: "alex-ai-sec" | "elena-grc" | "marcus-it") => void;
  onSaveCustomUser: (user: UserAccount, profile: CandidateProfile) => void;
  onOpenGovernance: () => void;
}

export function UserManagementModal({
  currentUser,
  isOpen,
  onClose,
  onSelectPersona,
  onSaveCustomUser,
  onOpenGovernance,
}: UserManagementModalProps) {
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [customRole, setCustomRole] = useState<"Candidate" | "Recruiter" | "Auditor / GRC Lead">("Candidate");

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customEmail) return;

    const initials = customName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newUser: UserAccount = {
      id: `user-custom-${Date.now()}`,
      name: customName,
      email: customEmail,
      role: customRole,
      avatar: initials || "CU",
      isDemo: false,
      activePersonaId: "custom",
    };

    const newProfile: CandidateProfile = {
      full_name: customName,
      current_title: `${customRole} Specialist`,
      primary_domain: "AI",
      years_experience: 5,
      skills: ["Python", "Cloud Architecture", "Security Controls", "Data Pipelines"],
      certifications: ["Industry Certified"],
      target_salary_min: 110000,
      preferred_work_mode: "Hybrid",
      resume_text: `${customName} - ${customRole} Specialist with verified background in high-growth technology systems.`,
    };

    onSaveCustomUser(newUser, newProfile);
    setIsCreatingCustom(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#245e49] flex items-center justify-center text-white font-black shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                User Management & Identity
              </h3>
              <p className="text-xs text-slate-400">
                Switch candidate demo personas or manage your persistent account.
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

        {/* Active Account Overview Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#245e49] text-white font-black text-lg flex items-center justify-center shadow-sm">
              {currentUser.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-900 text-base">
                  {currentUser.name}
                </h4>
                {currentUser.isDemo && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-500/30 uppercase">
                    Verified Default Account
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {currentUser.email} • <span className="text-slate-600 font-semibold">{currentUser.role}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-500/30 text-emerald-700 text-xs font-mono font-bold">
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prisma Synced</span>
          </div>
        </div>

        {/* 1-Click Default Demo Persona Switcher */}
        {!isCreatingCustom ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Switch Pre-Configured Personas
              </span>
              <button
                onClick={() => setIsCreatingCustom(true)}
                className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Custom Account</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Persona 1: Alex Mercer (AI/Security) */}
              <div
                onClick={() => {
                  onSelectPersona("alex-ai-sec");
                  onClose();
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  currentUser.activePersonaId === "alex-ai-sec"
                    ? "bg-sky-50 border-cyan-500 shadow-md ring-1 ring-cyan-500/40"
                    : "bg-slate-50/50 hover:bg-slate-100 border-slate-200/70"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-sky-700 text-xs font-bold flex items-center justify-center">
                    AM
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-sky-700" />
                </div>
                <h5 className="font-bold text-slate-900 text-xs">Alex Mercer</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  Senior AI & Security Infrastructure Engineer (LLMOps & eBPF)
                </p>
              </div>

              {/* Persona 2: Elena Beaumont (Governance/GRC) */}
              <div
                onClick={() => {
                  onSelectPersona("elena-grc");
                  onClose();
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  currentUser.activePersonaId === "elena-grc"
                    ? "bg-amber-50 border-amber-500 shadow-md ring-1 ring-amber-500/40"
                    : "bg-slate-50/50 hover:bg-slate-100 border-slate-200/70"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-700 text-xs font-bold flex items-center justify-center">
                    EB
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <h5 className="font-bold text-slate-900 text-xs">Elena Beaumont</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  Director of AI Governance & GRC (EU AI Act & ISO 42001)
                </p>
              </div>

              {/* Persona 3: Marcus Sterling (Enterprise IT) */}
              <div
                onClick={() => {
                  onSelectPersona("marcus-it");
                  onClose();
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  currentUser.activePersonaId === "marcus-it"
                    ? "bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/40"
                    : "bg-slate-50/50 hover:bg-slate-100 border-slate-200/70"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-700 text-xs font-bold flex items-center justify-center">
                    MS
                  </span>
                  <Cpu className="w-3.5 h-3.5 text-indigo-700" />
                </div>
                <h5 className="font-bold text-slate-900 text-xs">Marcus Sterling</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  Principal Cloud & Enterprise IT Architect (Kubernetes & Entra)
                </p>
              </div>

            </div>
          </div>
        ) : (
          /* Create Custom Account Form */
          <form onSubmit={handleCustomSubmit} className="space-y-4 text-xs p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-sm">Create New Account</span>
              <button
                type="button"
                onClick={() => setIsCreatingCustom(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                Back to Personas
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="e.g. jordan@techcorp.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Primary Role</label>
              <select
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
              >
                <option value="Candidate">Candidate (Job Seeker)</option>
                <option value="Recruiter">Recruiter / Talent Lead</option>
                <option value="Auditor / GRC Lead">Auditor / GRC Lead</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingCustom(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#245e49] text-white rounded-xl font-bold"
              >
                Save & Switch Account
              </button>
            </div>
          </form>
        )}

        {/* Footer / Privacy & Governance Link */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => {
              onClose();
              onOpenGovernance();
            }}
            className="text-sky-700 hover:underline flex items-center gap-1 font-semibold"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>GDPR Data Rights & EU AI Act Disclosure</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
