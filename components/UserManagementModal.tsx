"use client";

import React, { useState } from "react";
import { ArrowLeft, Cloud, CloudUpload, Cpu, HardDrive, Loader2, Lock, ShieldCheck, Sparkles, UserCheck, UserPlus } from "lucide-react";
import { AuthenticatedAccount, CandidateProfile, UserAccount } from "@/lib/types";
import type { ProfileProtectionState } from "@/lib/profileProtection";
import type { SavedItemsProtectionState, SavedItemsSnapshot } from "@/lib/savedItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { StatusNotice } from "@/components/ui/status-notice";

type PersonaKey = "alex-ai-sec" | "elena-grc" | "marcus-it";

interface UserManagementModalProps {
  currentUser: UserAccount;
  authenticatedAccount?: AuthenticatedAccount | null;
  profile: CandidateProfile;
  protectedProfile?: CandidateProfile | null;
  profileProtectionState?: ProfileProtectionState;
  savedJobIds?: string[];
  favouriteCompanyIds?: string[];
  protectedSavedItems?: SavedItemsSnapshot | null;
  savedItemsProtectionState?: SavedItemsProtectionState;
  isOpen: boolean;
  onClose: () => void;
  onSelectPersona: (personaKey: PersonaKey) => void;
  onSaveCustomUser: (user: UserAccount, profile: CandidateProfile) => void;
  onProtectProfile?: () => Promise<void>;
  onUseProtectedProfile?: () => void;
  onProtectSavedItems?: () => Promise<void>;
  onUseProtectedSavedItems?: () => void;
  onOpenGovernance: () => void;
}

const personas: Array<{ key: PersonaKey; initials: string; name: string; description: string; icon: typeof Sparkles; accent: string }> = [
  { key: "alex-ai-sec", initials: "AM", name: "Alex Mercer", description: "Senior AI and security infrastructure engineer", icon: Sparkles, accent: "bg-sky-50 text-sky-700" },
  { key: "elena-grc", initials: "EB", name: "Elena Beaumont", description: "Director of AI governance and GRC", icon: ShieldCheck, accent: "bg-amber-50 text-amber-700" },
  { key: "marcus-it", initials: "MS", name: "Marcus Sterling", description: "Principal cloud and enterprise IT architect", icon: Cpu, accent: "bg-indigo-50 text-indigo-700" },
];

export function UserManagementModal({ currentUser, authenticatedAccount, profile, protectedProfile, profileProtectionState = "unavailable", savedJobIds = [], favouriteCompanyIds = [], protectedSavedItems, savedItemsProtectionState = "unavailable", isOpen, onClose, onSelectPersona, onSaveCustomUser, onProtectProfile, onUseProtectedProfile, onProtectSavedItems, onUseProtectedSavedItems, onOpenGovernance }: UserManagementModalProps) {
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [pendingResolution, setPendingResolution] = useState<"device" | "protected" | null>(null);
  const [pendingSavedItemsResolution, setPendingSavedItemsResolution] = useState<"device" | "protected" | null>(null);

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
      role: "User",
      avatar: initials || "CU",
      isDemo: false,
      activePersonaId: "custom",
    };
    const profile: CandidateProfile = {
      full_name: name,
      current_title: "",
      primary_domain: "AI",
      years_experience: 0,
      skills: [],
      certifications: [],
      preferred_work_mode: "Any",
      resume_text: "",
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
          <StatusNotice tone="info" title="One product role">
            Every local profile represents a person using Vecta to discover roles and manage their own career search.
          </StatusNotice>
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
                <p className="truncate text-xs text-slate-500">{currentUser.email} · Vecta user</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="account-status-heading" className={`rounded-2xl border p-4 ${authenticatedAccount?.persisted ? "border-emerald-200 bg-emerald-50/70" : "border-blue-100 bg-blue-50/60"}`}>
            <div className="flex items-start gap-3">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${authenticatedAccount?.persisted ? "text-emerald-700" : "text-blue-700"}`}>
                {authenticatedAccount?.persisted ? <Cloud className="h-4 w-4" aria-hidden="true" /> : <HardDrive className="h-4 w-4" aria-hidden="true" />}
              </span>
              <div>
                <h3 id="account-status-heading" className="text-sm font-semibold text-slate-900">{authenticatedAccount?.persisted ? "Protected account connected" : "Device-local preview"}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {authenticatedAccount?.persisted
                    ? `Signed in as ${authenticatedAccount.name || authenticatedAccount.email}. Your account identity is stored securely; career data is copied only when you review and confirm it below.`
                    : "This profile and its career data are stored in this browser. Secure sign-in, recovery, and cross-device access are the next account milestone."}
                </p>
              </div>
            </div>
          </section>

          {authenticatedAccount?.persisted && (
            <section aria-labelledby="profile-protection-heading" className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  {profileProtectionState === "checking" || profileProtectionState === "saving"
                    ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    : <CloudUpload className="h-4 w-4" aria-hidden="true" />}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 id="profile-protection-heading" className="text-sm font-semibold text-slate-900">
                    {profileProtectionState === "protected" ? "Career profile protected" : profileProtectionState === "conflict" ? "Choose which profile to keep" : "Protected career profile"}
                  </h3>

                  {(profileProtectionState === "checking" || profileProtectionState === "saving") && (
                    <p className="mt-1 text-xs leading-5 text-slate-600">{profileProtectionState === "saving" ? "Saving your reviewed profile and evidence…" : "Checking this device against your protected profile…"}</p>
                  )}

                  {profileProtectionState === "local-only" && (
                    <div className="mt-2 space-y-3">
                      <p className="text-xs leading-5 text-slate-600">Review before copying: <strong>{profile.full_name}</strong>{profile.current_title ? ` · ${profile.current_title}` : ""}, {profile.skills.length} skills and {profile.evidence?.length ?? 0} evidence records. Your device copy remains available.</p>
                      <Button size="sm" variant="primary" onClick={() => void onProtectProfile?.()}>
                        Copy this profile to protected account
                      </Button>
                    </div>
                  )}

                  {profileProtectionState === "protected" && (
                    <p className="mt-1 text-xs leading-5 text-slate-600">This profile, its preferences, résumé text, fit corrections, and {profile.evidence?.length ?? 0} evidence records match the protected account copy.</p>
                  )}

                  {profileProtectionState === "conflict" && protectedProfile && (
                    <div className="mt-2 space-y-3">
                      <p className="text-xs leading-5 text-slate-600">This device has <strong>{profile.full_name}</strong>; the protected account has <strong>{protectedProfile.full_name}</strong>. Vecta will not choose or overwrite either copy automatically.</p>
                      {!pendingResolution ? (
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="primary" onClick={() => setPendingResolution("protected")}>Use protected profile</Button>
                          <Button size="sm" onClick={() => setPendingResolution("device")}>Keep this device profile</Button>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                          <p className="text-xs leading-5 text-amber-900">
                            {pendingResolution === "protected"
                              ? `Replace this device’s active profile with ${protectedProfile.full_name}?`
                              : `Replace the protected account copy with ${profile.full_name}?`}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant={pendingResolution === "device" ? "danger" : "primary"}
                              onClick={() => {
                                if (pendingResolution === "protected") onUseProtectedProfile?.();
                                else void onProtectProfile?.();
                                setPendingResolution(null);
                              }}
                            >
                              Confirm replacement
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setPendingResolution(null)}>Cancel</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {profileProtectionState === "error" && (
                    <p className="mt-1 text-xs leading-5 text-rose-700">The protected copy could not be checked. Nothing on this device was changed; try again later before replacing either version.</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {authenticatedAccount?.persisted && (
            <section aria-labelledby="saved-items-protection-heading" className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  {savedItemsProtectionState === "checking" || savedItemsProtectionState === "saving"
                    ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    : <CloudUpload className="h-4 w-4" aria-hidden="true" />}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 id="saved-items-protection-heading" className="text-sm font-semibold text-slate-900">
                    {savedItemsProtectionState === "protected" ? "Saved lists protected" : savedItemsProtectionState === "conflict" ? "Choose which saved lists to keep" : "Protected saved lists"}
                  </h3>

                  {(savedItemsProtectionState === "checking" || savedItemsProtectionState === "saving") && (
                    <p className="mt-1 text-xs leading-5 text-slate-600">{savedItemsProtectionState === "saving" ? "Saving your reviewed role and company lists…" : "Checking this device against your protected saved lists…"}</p>
                  )}

                  {savedItemsProtectionState === "local-only" && (
                    <div className="mt-2 space-y-3">
                      <p className="text-xs leading-5 text-slate-600">Review before copying: this device has <strong>{savedJobIds.length} saved roles</strong> and <strong>{favouriteCompanyIds.length} saved companies</strong>. An empty list is saved intentionally.</p>
                      <Button size="sm" variant="primary" onClick={() => void onProtectSavedItems?.()}>
                        Copy saved lists to protected account
                      </Button>
                    </div>
                  )}

                  {savedItemsProtectionState === "protected" && (
                    <p className="mt-1 text-xs leading-5 text-slate-600">This device’s {savedJobIds.length} saved roles and {favouriteCompanyIds.length} saved companies match the protected account copy.</p>
                  )}

                  {savedItemsProtectionState === "conflict" && protectedSavedItems && (
                    <div className="mt-2 space-y-3">
                      <p className="text-xs leading-5 text-slate-600">This device has <strong>{savedJobIds.length} roles / {favouriteCompanyIds.length} companies</strong>; the protected account has <strong>{protectedSavedItems.savedJobIds.length} roles / {protectedSavedItems.favouriteCompanyIds.length} companies</strong>. Neither copy will be overwritten automatically.</p>
                      {!pendingSavedItemsResolution ? (
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="primary" onClick={() => setPendingSavedItemsResolution("protected")}>Use protected saved lists</Button>
                          <Button size="sm" onClick={() => setPendingSavedItemsResolution("device")}>Keep this device’s saved lists</Button>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                          <p className="text-xs leading-5 text-amber-900">
                            {pendingSavedItemsResolution === "protected"
                              ? "Replace this device’s saved roles and companies with the protected lists?"
                              : "Replace the protected role and company lists with this device’s lists?"}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant={pendingSavedItemsResolution === "device" ? "danger" : "primary"}
                              onClick={() => {
                                if (pendingSavedItemsResolution === "protected") onUseProtectedSavedItems?.();
                                else void onProtectSavedItems?.();
                                setPendingSavedItemsResolution(null);
                              }}
                            >
                              Confirm replacement
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setPendingSavedItemsResolution(null)}>Cancel</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {savedItemsProtectionState === "error" && (
                    <p className="mt-1 text-xs leading-5 text-rose-700">The protected saved lists could not be checked. Nothing on this device was changed; try again before replacing either version.</p>
                  )}
                </div>
              </div>
            </section>
          )}

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
