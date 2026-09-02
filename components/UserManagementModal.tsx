"use client";

import React, { useState } from "react";
import { ArrowLeft, Cpu, Lock, ShieldCheck, Sparkles, UserCheck, UserPlus } from "lucide-react";
import { CandidateProfile, UserAccount } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusNotice } from "@/components/ui/status-notice";

type PersonaKey = "alex-ai-sec" | "elena-grc" | "marcus-it";
type AccountRole = "Candidate" | "Recruiter" | "Auditor / GRC Lead";

interface UserManagementModalProps {
  currentUser: UserAccount;
  isOpen: boolean;
  onClose: () => void;
  onSelectPersona: (personaKey: PersonaKey) => void;
  onSaveCustomUser: (user: UserAccount, profile: CandidateProfile) => void;
  onOpenGovernance: () => void;
}

const personas: Array<{ key: PersonaKey; initials: string; name: string; description: string; icon: typeof Sparkles; accent: string }> = [
  { key: "alex-ai-sec", initials: "AM", name: "Alex Mercer", description: "Senior AI and security infrastructure engineer", icon: Sparkles, accent: "bg-sky-50 text-sky-700" },
  { key: "elena-grc", initials: "EB", name: "Elena Beaumont", description: "Director of AI governance and GRC", icon: ShieldCheck, accent: "bg-amber-50 text-amber-700" },
  { key: "marcus-it", initials: "MS", name: "Marcus Sterling", description: "Principal cloud and enterprise IT architect", icon: Cpu, accent: "bg-indigo-50 text-indigo-700" },
];

export function UserManagementModal({ currentUser, isOpen, onClose, onSelectPersona, onSaveCustomUser, onOpenGovernance }: UserManagementModalProps) {
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [customRole, setCustomRole] = useState<AccountRole>("Candidate");

  if (!isOpen) return null;

  const handleCustomSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const name = customName.trim();
    const email = customEmail.trim();
    if (!name || !email) return;

    const initials = name.split(/\s+/).map((part) => part[0]).join("").toUpperCase().slice(0, 2);
    const user: UserAccount = {
      id: `user-custom-${Date.now()}`,
      name,
      email,
      role: customRole,
      avatar: initials || "CU",
      isDemo: false,
      activePersonaId: "custom",
    };
    const profile: CandidateProfile = {
      full_name: name,
      current_title: `${customRole} Specialist`,
      primary_domain: "AI",
      years_experience: 5,
      skills: ["Python", "Cloud Architecture", "Security Controls", "Data Pipelines"],
      certifications: ["Industry Certified"],
      target_salary_min: 110000,
      preferred_work_mode: "Hybrid",
      resume_text: `${name} - ${customRole} Specialist with a background in technology systems.`,
    };

    onSaveCustomUser(user, profile);
    setIsCreatingCustom(false);
    onClose();
  };

  const selectPersona = (key: PersonaKey) => {
    onSelectPersona(key);
    onClose();
  };

  return (
    <DialogShell
      titleId="profile-switcher-title"
      title={isCreatingCustom ? "Create a local profile" : "Profiles on this device"}
      description={isCreatingCustom ? "Set up a local demonstration profile. This does not create a signed-in account." : "Switch between demonstration profiles or create a local profile for this browser."}
      icon={isCreatingCustom ? <UserPlus className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
      onClose={onClose}
      closeLabel="Close profile switcher"
      size="md"
      footer={(
        <div className="flex flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center">
          <Button variant="ghost" size="sm" onClick={() => { onClose(); onOpenGovernance(); }}>
            <Lock className="h-4 w-4" /> Privacy and data rights
          </Button>
          <Button size="sm" onClick={onClose}>Close</Button>
        </div>
      )}
    >
      {isCreatingCustom ? (
        <form id="local-profile-form" onSubmit={handleCustomSubmit} className="space-y-5">
          <Button variant="ghost" size="sm" onClick={() => setIsCreatingCustom(false)} className="-ml-2">
            <ArrowLeft className="h-4 w-4" /> Back to profiles
          </Button>
          <StatusNotice tone="info" title="Local prototype profile">
            Details are stored in this browser. Sign-in, recovery, sessions, and multi-device access are roadmap work.
          </StatusNotice>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="custom-profile-name" label="Full name" required>
              <Input id="custom-profile-name" required autoFocus value={customName} onChange={(event) => setCustomName(event.target.value)} placeholder="Jordan Smith" />
            </Field>
            <Field id="custom-profile-email" label="Email address" required hint="Used only in this local prototype profile.">
              <Input id="custom-profile-email" type="email" required value={customEmail} onChange={(event) => setCustomEmail(event.target.value)} placeholder="jordan@example.com" />
            </Field>
          </div>
          <Field id="custom-profile-role" label="Profile role">
            <Select id="custom-profile-role" value={customRole} onChange={(event) => setCustomRole(event.target.value as AccountRole)}>
              <option value="Candidate">Candidate</option>
              <option value="Recruiter">Recruiter / Talent Lead</option>
              <option value="Auditor / GRC Lead">Auditor / GRC Lead</option>
            </Select>
          </Field>
          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <Button onClick={() => setIsCreatingCustom(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save and switch profile</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-5">
          <section aria-labelledby="active-profile-heading" className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p id="active-profile-heading" className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Active profile</p>
            <div className="mt-3 flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">{currentUser.avatar}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-semibold text-slate-900">{currentUser.name}</p>
                  {currentUser.isDemo && <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">Demo profile</Badge>}
                </div>
                <p className="truncate text-xs text-slate-500">{currentUser.email} · {currentUser.role}</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="demo-profile-heading">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 id="demo-profile-heading" className="text-sm font-semibold text-slate-900">Demonstration profiles</h3>
                <p className="mt-0.5 text-xs text-slate-500">Each profile changes the skills, evidence, and role-fit examples.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setIsCreatingCustom(true)}>
                <UserPlus className="h-4 w-4" /> Create local profile
              </Button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {personas.map(({ key, initials, name, description, icon: Icon, accent }) => {
                const selected = currentUser.activePersonaId === key;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => selectPersona(key)}
                    className={`min-h-36 rounded-2xl border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${selected ? "border-blue-400 bg-blue-50 ring-1 ring-blue-200" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}
                  >
                    <span className="flex items-center justify-between">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold ${accent}`}>{initials}</span>
                      <Icon className={`h-4 w-4 ${accent.split(" ")[1]}`} aria-hidden="true" />
                    </span>
                    <span className="mt-3 block text-xs font-semibold text-slate-900">{name}</span>
                    <span className="mt-1 block text-[11px] leading-4 text-slate-500">{description}</span>
                    <span className="sr-only">{selected ? "Current profile" : "Switch to this profile"}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </DialogShell>
  );
}
