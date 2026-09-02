"use client";

import React, { useState } from "react";
import { Plus, Save, UserCheck, X } from "lucide-react";
import { CandidateProfile, DomainType } from "@/lib/types";
import { ProfileEvidenceManager } from "@/components/ProfileEvidenceManager";
import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ProfileDrawerProps {
  profile: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: CandidateProfile) => void;
}

export function ProfileDrawer({ profile, isOpen, onClose, onSaveProfile }: ProfileDrawerProps) {
  const [formData, setFormData] = useState<CandidateProfile>(profile);
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");

  if (!isOpen) return null;

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    if (!formData.skills.includes(skill)) setFormData((current) => ({ ...current, skills: [...current.skills, skill] }));
    setSkillInput("");
  };

  const addCertification = () => {
    const certification = certInput.trim();
    if (!certification) return;
    if (!formData.certifications.includes(certification)) {
      setFormData((current) => ({ ...current, certifications: [...current.certifications, certification] }));
    }
    setCertInput("");
  };

  const handleTokenKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, add: () => void) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    add();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <DialogShell
      titleId="candidate-profile-title"
      title="Candidate profile"
      description="Review the information used by Vecta’s deterministic fit estimates and application templates."
      icon={<UserCheck className="h-5 w-5" />}
      onClose={onClose}
      closeLabel="Close candidate profile"
      size="drawer"
      placement="right"
      bodyClassName="flex overflow-hidden p-0 sm:p-0"
      footer={(
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-slate-500">Changes are stored in this browser.</span>
          <Button type="submit" form="candidate-profile-form" variant="primary">
            <Save className="h-4 w-4" /> Save profile
          </Button>
        </div>
      )}
    >
      <form id="candidate-profile-form" onSubmit={handleSubmit} className="h-full space-y-6 overflow-y-auto p-5 text-xs sm:p-6">
        <section aria-labelledby="profile-basics-heading" className="space-y-4">
          <div>
            <h3 id="profile-basics-heading" className="text-sm font-semibold text-slate-900">Career direction</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">Keep these details current so role comparisons use the right context.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="drawer-profile-name" label="Full name" required>
              <Input id="drawer-profile-name" required value={formData.full_name} onChange={(event) => setFormData({ ...formData, full_name: event.target.value })} />
            </Field>
            <Field id="drawer-profile-title" label="Current or target title" required>
              <Input id="drawer-profile-title" required value={formData.current_title} onChange={(event) => setFormData({ ...formData, current_title: event.target.value })} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field id="drawer-profile-domain" label="Primary discipline">
              <Select id="drawer-profile-domain" value={formData.primary_domain} onChange={(event) => setFormData({ ...formData, primary_domain: event.target.value as DomainType })}>
                <option value="AI">AI & Machine Learning</option>
                <option value="Security">Cybersecurity</option>
                <option value="Governance">Governance & GRC</option>
                <option value="IT">IT & Cloud</option>
              </Select>
            </Field>
            <Field id="drawer-profile-experience" label="Years’ experience">
              <Input id="drawer-profile-experience" type="number" min="0" max="50" value={formData.years_experience} onChange={(event) => setFormData({ ...formData, years_experience: Number(event.target.value) })} />
            </Field>
            <Field id="drawer-profile-salary" label="Target salary (£)">
              <Input id="drawer-profile-salary" type="number" min="0" step="5000" value={formData.target_salary_min ?? ""} onChange={(event) => setFormData({ ...formData, target_salary_min: Number(event.target.value) || undefined })} />
            </Field>
          </div>
        </section>

        <section aria-labelledby="profile-expertise-heading" className="space-y-4 border-t border-slate-200 pt-5">
          <div>
            <h3 id="profile-expertise-heading" className="text-sm font-semibold text-slate-900">Skills and credentials</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">Add exact technologies, practices, standards, and current certifications.</p>
          </div>
          <Field id="drawer-skill" label={`Skills (${formData.skills.length})`} hint="Type a skill and press Enter, or use Add.">
            <div className="flex gap-2">
              <Input id="drawer-skill" value={skillInput} onChange={(event) => setSkillInput(event.target.value)} onKeyDown={(event) => handleTokenKeyDown(event, addSkill)} placeholder="e.g. Kubernetes" aria-describedby="drawer-skill-hint" />
              <Button size="icon" onClick={addSkill} aria-label="Add skill"><Plus className="h-4 w-4" /></Button>
            </div>
          </Field>
          <ul aria-label="Saved skills" className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <li key={skill} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-1 pl-2.5 pr-1 text-xs text-slate-700">
                <span>{skill}</span>
                <Button type="button" onClick={() => setFormData((current) => ({ ...current, skills: current.skills.filter((item) => item !== skill) }))} variant="ghost" size="icon" className="h-7 w-7 rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-700" aria-label={`Remove ${skill}`}><X className="h-3 w-3" /></Button>
              </li>
            ))}
          </ul>

          <Field id="drawer-certification" label={`Certifications (${formData.certifications.length})`} hint="Type a certification and press Enter, or use Add.">
            <div className="flex gap-2">
              <Input id="drawer-certification" value={certInput} onChange={(event) => setCertInput(event.target.value)} onKeyDown={(event) => handleTokenKeyDown(event, addCertification)} placeholder="e.g. CISSP" aria-describedby="drawer-certification-hint" />
              <Button size="icon" onClick={addCertification} aria-label="Add certification"><Plus className="h-4 w-4" /></Button>
            </div>
          </Field>
          <ul aria-label="Saved certifications" className="flex flex-wrap gap-2">
            {formData.certifications.map((certification) => (
              <li key={certification} className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 py-1 pl-2.5 pr-1 text-xs text-amber-800">
                <span>{certification}</span>
                <Button type="button" onClick={() => setFormData((current) => ({ ...current, certifications: current.certifications.filter((item) => item !== certification) }))} variant="ghost" size="icon" className="h-7 w-7 rounded-md text-amber-700 hover:bg-white hover:text-rose-700" aria-label={`Remove ${certification}`}><X className="h-3 w-3" /></Button>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="profile-history-heading" className="space-y-4 border-t border-slate-200 pt-5">
          <div>
            <h3 id="profile-history-heading" className="text-sm font-semibold text-slate-900">Career history and evidence</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">This reviewed text is checked locally for role-relevant terms. It is not sent to an AI service.</p>
          </div>
          <Field id="drawer-profile-history" label="Résumé or career summary">
            <Textarea id="drawer-profile-history" rows={7} value={formData.resume_text} onChange={(event) => setFormData({ ...formData, resume_text: event.target.value })} placeholder="Paste your résumé text, project highlights, or key achievements…" className="resize-y leading-6" />
          </Field>
          <ProfileEvidenceManager evidence={formData.evidence ?? []} skills={formData.skills} certifications={formData.certifications} onChange={(evidence) => setFormData({ ...formData, evidence })} />
        </section>
      </form>
    </DialogShell>
  );
}
