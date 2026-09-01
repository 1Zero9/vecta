"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness, Check, FileBadge2, FolderKanban, Pencil, Plus, Trash2, X } from "lucide-react";
import { ProfileEvidence, ProfileEvidenceType } from "@/lib/types";

interface ProfileEvidenceManagerProps {
  evidence: ProfileEvidence[];
  skills: string[];
  certifications: string[];
  onChange: (evidence: ProfileEvidence[]) => void;
}

interface EvidenceDraft {
  type: ProfileEvidenceType;
  title: string;
  organization: string;
  period: string;
  description: string;
  claims: string[];
}

const emptyDraft: EvidenceDraft = {
  type: "Employment",
  title: "",
  organization: "",
  period: "",
  description: "",
  claims: [],
};

const typeIcons = {
  Employment: BriefcaseBusiness,
  Project: FolderKanban,
  Certification: FileBadge2,
} as const;

function makeEvidenceId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `evidence-${Date.now()}`;
}

export function ProfileEvidenceManager({ evidence, skills, certifications, onChange }: ProfileEvidenceManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EvidenceDraft>(emptyDraft);
  const [error, setError] = useState<string | null>(null);

  const availableClaims = useMemo(() => {
    const seen = new Set<string>();
    return [...skills, ...certifications].filter((claim) => {
      const key = claim.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [skills, certifications]);

  const startAdding = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setError(null);
    setIsEditing(true);
  };

  const startEditing = (item: ProfileEvidence) => {
    setEditingId(item.id);
    setDraft({
      type: item.type,
      title: item.title,
      organization: item.organization ?? "",
      period: item.period ?? "",
      description: item.description,
      claims: item.claims,
    });
    setError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingId(null);
    setDraft(emptyDraft);
    setError(null);
  };

  const toggleClaim = (claim: string) => {
    setDraft((current) => ({
      ...current,
      claims: current.claims.includes(claim)
        ? current.claims.filter((item) => item !== claim)
        : [...current.claims, claim],
    }));
  };

  const saveEvidence = () => {
    if (!draft.title.trim() || !draft.description.trim()) {
      setError("Add a title and a short description of the evidence.");
      return;
    }
    if (draft.claims.length === 0) {
      setError("Connect this evidence to at least one skill or certification.");
      return;
    }

    const nextItem: ProfileEvidence = {
      id: editingId ?? makeEvidenceId(),
      type: draft.type,
      title: draft.title.trim(),
      organization: draft.organization.trim() || undefined,
      period: draft.period.trim() || undefined,
      description: draft.description.trim(),
      claims: draft.claims,
    };

    onChange(
      editingId
        ? evidence.map((item) => (item.id === editingId ? nextItem : item))
        : [...evidence, nextItem],
    );
    cancelEditing();
  };

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5" aria-labelledby="profile-evidence-heading">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 id="profile-evidence-heading" className="text-sm font-semibold text-slate-900">Evidence links</h4>
          <p className="mt-0.5 text-xs leading-5 text-slate-500">Connect important claims to work, projects, or credentials you can discuss.</p>
        </div>
        {!isEditing && (
          <button type="button" onClick={startAdding} className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm hover:border-blue-200 hover:bg-blue-50">
            <Plus className="h-3.5 w-3.5" /> Add evidence
          </button>
        )}
      </div>

      {evidence.length === 0 && !isEditing && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-5 text-center">
          <p className="text-xs font-medium text-slate-700">No claims are linked yet.</p>
          <p className="mt-1 text-[11px] leading-4 text-slate-500">Start with one strong project, role, or certification.</p>
        </div>
      )}

      {evidence.length > 0 && (
        <div className="space-y-2">
          {evidence.map((item) => {
            const Icon = typeIcons[item.type];
            return (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Icon className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-0.5 text-[10px] text-slate-500">
                          {[item.type, item.organization, item.period].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button type="button" onClick={() => startEditing(item)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-700" aria-label={`Edit ${item.title}`}><Pencil className="h-3.5 w-3.5" /></button>
                        <button type="button" onClick={() => onChange(evidence.filter((candidate) => candidate.id !== item.id))} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-700" aria-label={`Remove ${item.title}`}><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-slate-600">{item.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.claims.map((claim) => <span key={claim} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-100">{claim}</span>)}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {isEditing && (
        <div className="space-y-3 rounded-xl border border-blue-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-900">{editingId ? "Edit evidence" : "Add evidence"}</p>
            <button type="button" onClick={cancelEditing} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Cancel evidence editing"><X className="h-4 w-4" /></button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-[11px] font-semibold text-slate-600">
              Evidence type
              <select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as ProfileEvidenceType })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="Employment">Employment</option>
                <option value="Project">Project</option>
                <option value="Certification">Certification</option>
              </select>
            </label>
            <label className="text-[11px] font-semibold text-slate-600">
              Title
              <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="e.g. Cloud migration programme" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="text-[11px] font-semibold text-slate-600">
              Organisation <span className="font-normal text-slate-400">(optional)</span>
              <input value={draft.organization} onChange={(event) => setDraft({ ...draft, organization: event.target.value })} placeholder="Company or issuer" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="text-[11px] font-semibold text-slate-600">
              Period <span className="font-normal text-slate-400">(optional)</span>
              <input value={draft.period} onChange={(event) => setDraft({ ...draft, period: event.target.value })} placeholder="2023–2025" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
          </div>

          <label className="block text-[11px] font-semibold text-slate-600">
            What does this prove?
            <textarea rows={3} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Describe your responsibility, outcome, or credential in a sentence or two." className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs leading-5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </label>

          <fieldset>
            <legend className="text-[11px] font-semibold text-slate-600">Claims supported</legend>
            {availableClaims.length > 0 ? (
              <div className="mt-2 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto pr-1">
                {availableClaims.map((claim) => {
                  const selected = draft.claims.includes(claim);
                  return (
                    <button key={claim} type="button" onClick={() => toggleClaim(claim)} aria-pressed={selected} className={`flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium transition ${selected ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500 hover:border-blue-200"}`}>
                      {selected && <Check className="h-3 w-3" />} {claim}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[10px] leading-4 text-amber-700">Add skills or certifications before linking evidence.</p>
            )}
          </fieldset>

          {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-[10px] font-medium text-rose-700">{error}</p>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={cancelEditing} className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="button" onClick={saveEvidence} className="rounded-lg bg-blue-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-blue-700">{editingId ? "Save changes" : "Link evidence"}</button>
          </div>
        </div>
      )}
    </section>
  );
}
