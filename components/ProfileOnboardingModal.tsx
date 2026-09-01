"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  FileText,
  MapPin,
  Sparkles,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { CandidateProfile, DomainType, WorkMode } from "@/lib/types";
import { getProfileCompletion } from "@/lib/profileCompletion";
import { ResumeUploadReview } from "@/components/ResumeUploadReview";
import { ProfileEvidenceManager } from "@/components/ProfileEvidenceManager";

interface ProfileOnboardingModalProps {
  profile: CandidateProfile;
  onClose: () => void;
  onSave: (profile: CandidateProfile) => void;
}

const steps = [
  { title: "Direction", description: "Where you are heading", icon: BriefcaseBusiness },
  { title: "Preferences", description: "What good work looks like", icon: MapPin },
  { title: "Expertise", description: "What you bring", icon: Wrench },
  { title: "Evidence", description: "What supports your profile", icon: FileText },
] as const;

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function parseList(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

export function ProfileOnboardingModal({ profile, onClose, onSave }: ProfileOnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CandidateProfile>({
    ...profile,
    preferred_locations: profile.preferred_locations ?? [],
    evidence: profile.evidence ?? [],
  });
  const [locationsText, setLocationsText] = useState((profile.preferred_locations ?? []).join(", "));
  const [skillsText, setSkillsText] = useState(profile.skills.join(", "));
  const [certificationsText, setCertificationsText] = useState(profile.certifications.join(", "));

  const workingProfile = useMemo(
    () => ({
      ...formData,
      preferred_locations: parseList(locationsText),
      skills: parseList(skillsText),
      certifications: parseList(certificationsText),
    }),
    [formData, locationsText, skillsText, certificationsText],
  );

  const completion = getProfileCompletion(workingProfile);

  const validateStep = () => {
    if (step === 0 && (!workingProfile.full_name.trim() || !workingProfile.current_title.trim())) {
      return "Add your name and current or most recent role to continue.";
    }
    if (step === 1 && workingProfile.preferred_locations?.length === 0) {
      return "Add at least one preferred location or ‘Remote’.";
    }
    if (step === 2 && workingProfile.skills.length < 3) {
      return "Add at least three skills so Vecta can assess role fit.";
    }
    return null;
  };

  const handleNext = () => {
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }
    setError(null);
    setStep((current) => Math.min(steps.length - 1, current + 1));
  };

  const handleSave = () => {
    onSave(workingProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-3 backdrop-blur-sm sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-onboarding-title"
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="profile-onboarding-title" className="text-base font-semibold text-slate-900 sm:text-lg">
                  Build your Vecta profile
                </h2>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">About 3 minutes</span>
              </div>
              <p className="text-xs text-slate-500">Give fit scores the context they need to be useful.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close profile setup">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 md:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="border-b border-slate-200 bg-slate-50 p-4 md:border-b-0 md:border-r md:p-6">
            <div className="grid grid-cols-4 gap-2 md:grid-cols-1 md:gap-1.5">
              {steps.map((item, index) => {
                const Icon = item.icon;
                const isActive = index === step;
                const isComplete = index < step;
                return (
                  <button
                    key={item.title}
                    onClick={() => index < step && setStep(index)}
                    disabled={index > step}
                    className={`flex min-w-0 items-center gap-3 rounded-xl p-2.5 text-left transition md:w-full ${
                      isActive ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200" : isComplete ? "text-slate-700 hover:bg-white" : "text-slate-400"
                    }`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-blue-600 text-white" : isComplete ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                      {isComplete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </span>
                    <span className="hidden min-w-0 md:block">
                      <span className="block text-xs font-semibold">{item.title}</span>
                      <span className="block truncate text-[10px] text-slate-500">{item.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 hidden rounded-2xl border border-blue-100 bg-blue-50 p-4 md:block">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Profile strength</span>
                <span className="text-blue-700">{completion.score}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${completion.score}%` }} />
              </div>
              <p className="mt-2 text-[10px] leading-4 text-slate-500">You can return and improve this profile at any time.</p>
            </div>
          </aside>

          <div className="min-h-0 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
            {step === 0 && (
              <div className="mx-auto max-w-2xl space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Step 1 of 4</span>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Where are you heading?</h3>
                  <p className="mt-1 text-sm text-slate-500">Start with the role and discipline that best describe your career direction.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Full name
                    <input value={formData.full_name} onChange={(event) => setFormData({ ...formData, full_name: event.target.value })} className={`${inputClass} mt-1.5`} />
                  </label>
                  <label className="text-xs font-semibold text-slate-700">
                    Current or most recent role
                    <input value={formData.current_title} onChange={(event) => setFormData({ ...formData, current_title: event.target.value })} placeholder="e.g. Senior Platform Engineer" className={`${inputClass} mt-1.5`} />
                  </label>
                  <label className="text-xs font-semibold text-slate-700">
                    Primary discipline
                    <select value={formData.primary_domain} onChange={(event) => setFormData({ ...formData, primary_domain: event.target.value as DomainType })} className={`${inputClass} mt-1.5`}>
                      <option value="AI">AI & Machine Learning</option>
                      <option value="Security">Cybersecurity</option>
                      <option value="Governance">Governance & GRC</option>
                      <option value="IT">IT & Cloud</option>
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-slate-700">
                    Years of experience
                    <input type="number" min="0" max="50" value={formData.years_experience} onChange={(event) => setFormData({ ...formData, years_experience: Number(event.target.value) })} className={`${inputClass} mt-1.5`} />
                  </label>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="mx-auto max-w-2xl space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Step 2 of 4</span>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Define the right opportunity.</h3>
                  <p className="mt-1 text-sm text-slate-500">These preferences help Vecta separate interesting roles from genuinely practical ones.</p>
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-semibold text-slate-700">
                    Preferred locations
                    <input value={locationsText} onChange={(event) => setLocationsText(event.target.value)} placeholder="Dublin, London, Remote Europe" className={`${inputClass} mt-1.5`} />
                    <span className="mt-1.5 block font-normal text-slate-400">Separate multiple locations with commas. “Remote” is welcome.</span>
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-xs font-semibold text-slate-700">
                      Preferred work mode
                      <select value={formData.preferred_work_mode} onChange={(event) => setFormData({ ...formData, preferred_work_mode: event.target.value as WorkMode | "Any" })} className={`${inputClass} mt-1.5`}>
                        <option value="Any">Any</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Onsite">Onsite</option>
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-slate-700">
                      Minimum target salary (£)
                      <input type="number" min="0" step="5000" value={formData.target_salary_min ?? ""} onChange={(event) => setFormData({ ...formData, target_salary_min: Number(event.target.value) || undefined })} placeholder="100000" className={`${inputClass} mt-1.5`} />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mx-auto max-w-2xl space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Step 3 of 4</span>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">What do you bring?</h3>
                  <p className="mt-1 text-sm text-slate-500">Use specific technologies, practices, standards, and credentials. You can refine these later.</p>
                </div>
                <label className="block text-xs font-semibold text-slate-700">
                  Skills and capabilities
                  <textarea rows={4} value={skillsText} onChange={(event) => setSkillsText(event.target.value)} placeholder="Python, Kubernetes, ISO 42001, Stakeholder Management" className={`${inputClass} mt-1.5 resize-none`} />
                  <span className="mt-1.5 block font-normal text-slate-400">Add at least three, separated by commas.</span>
                </label>
                <label className="block text-xs font-semibold text-slate-700">
                  Certifications and accreditations
                  <textarea rows={3} value={certificationsText} onChange={(event) => setCertificationsText(event.target.value)} placeholder="CISSP, CKA, IAPP AIGP" className={`${inputClass} mt-1.5 resize-none`} />
                  <span className="mt-1.5 block font-normal text-slate-400">Optional, but useful when a role requires formal credentials.</span>
                </label>
              </div>
            )}

            {step === 3 && (
              <div className="mx-auto max-w-2xl space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Step 4 of 4</span>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Add evidence, not just keywords.</h3>
                  <p className="mt-1 text-sm text-slate-500">Upload your résumé, review what Vecta finds, or paste a career summary yourself. Nothing is accepted automatically.</p>
                </div>

                <ResumeUploadReview
                  currentSkills={workingProfile.skills}
                  currentCertifications={workingProfile.certifications}
                  currentYearsExperience={workingProfile.years_experience}
                  onApply={({ text, skills, certifications, yearsExperience }) => {
                    setFormData((current) => ({
                      ...current,
                      resume_text: text,
                      years_experience: yearsExperience,
                    }));
                    setSkillsText(skills.join(", "));
                    setCertificationsText(certifications.join(", "));
                  }}
                />

                <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                  <span className="h-px flex-1 bg-slate-200" /> Or paste text <span className="h-px flex-1 bg-slate-200" />
                </div>
                <label className="block text-xs font-semibold text-slate-700">
                  Career history and achievements
                  <textarea rows={9} value={formData.resume_text} onChange={(event) => setFormData({ ...formData, resume_text: event.target.value })} placeholder="Paste résumé text, key projects, responsibilities, and measurable outcomes…" className={`${inputClass} mt-1.5 resize-none leading-6`} />
                </label>

                <ProfileEvidenceManager
                  evidence={formData.evidence ?? []}
                  skills={workingProfile.skills}
                  certifications={workingProfile.certifications}
                  onChange={(evidence) => setFormData((current) => ({ ...current, evidence }))}
                />

                <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-slate-600">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <p><strong className="text-slate-800">Private by design.</strong> Résumé files are parsed in this browser and are never uploaded. Only the reviewed text and profile details are stored when you save.</p>
                </div>
              </div>
            )}

            {error && <p role="alert" className="mx-auto mt-5 max-w-2xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700">{error}</p>}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div className="hidden text-xs text-slate-500 sm:block">
            <span className="font-semibold text-slate-700">{completion.score}% complete</span> · saved to this device
          </div>
          <div className="ml-auto flex items-center gap-2">
            {step > 0 && (
              <button onClick={() => { setError(null); setStep((current) => current - 1); }} className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button onClick={handleNext} className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleSave} className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700">
                <Check className="h-4 w-4" /> Save profile
              </button>
            )}
          </div>
        </footer>
      </section>
    </div>
  );
}
