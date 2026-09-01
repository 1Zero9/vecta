"use client";

import { useRef, useState } from "react";
import { Check, FileCheck2, FileUp, LoaderCircle, LockKeyhole, RotateCcw, X } from "lucide-react";
import { extractResume, ResumeExtraction } from "@/lib/resumeExtraction";

interface ResumeUploadReviewProps {
  currentSkills: string[];
  currentCertifications: string[];
  currentYearsExperience: number;
  onApply: (data: {
    text: string;
    skills: string[];
    certifications: string[];
    yearsExperience: number;
  }) => void;
}

function uniqueItems(items: string[]): string[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.toLocaleLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function ResumeUploadReview({
  currentSkills,
  currentCertifications,
  currentYearsExperience,
  onApply,
}: ResumeUploadReviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "extracting" | "review" | "applied">("idle");
  const [error, setError] = useState<string | null>(null);
  const [extraction, setExtraction] = useState<ResumeExtraction | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState(currentYearsExperience);

  const reset = () => {
    setStatus("idle");
    setError(null);
    setExtraction(null);
    setReviewText("");
    setSelectedSkills([]);
    setSelectedCertifications([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const processFile = async (file?: File) => {
    if (!file) return;
    setStatus("extracting");
    setError(null);

    try {
      const result = await extractResume(file);
      const existingSkillKeys = new Set(currentSkills.map((item) => item.toLocaleLowerCase()));
      const existingCertificationKeys = new Set(currentCertifications.map((item) => item.toLocaleLowerCase()));
      const newSkills = result.suggestedSkills.filter((item) => !existingSkillKeys.has(item.toLocaleLowerCase()));
      const newCertifications = result.suggestedCertifications.filter(
        (item) => !existingCertificationKeys.has(item.toLocaleLowerCase()),
      );

      setExtraction(result);
      setReviewText(result.text);
      setSelectedSkills(newSkills);
      setSelectedCertifications(newCertifications);
      setYearsExperience(result.suggestedYearsExperience ?? currentYearsExperience);
      setStatus("review");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "We could not read this résumé.");
      setStatus("idle");
    }
  };

  const toggleItem = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
    setSelected(
      selected.some((candidate) => candidate.toLocaleLowerCase() === item.toLocaleLowerCase())
        ? selected.filter((candidate) => candidate.toLocaleLowerCase() !== item.toLocaleLowerCase())
        : [...selected, item],
    );
  };

  const applyReview = () => {
    onApply({
      text: reviewText,
      skills: uniqueItems([...currentSkills, ...selectedSkills]),
      certifications: uniqueItems([...currentCertifications, ...selectedCertifications]),
      yearsExperience,
    });
    setStatus("applied");
  };

  if (status === "review" && extraction) {
    const suggestedSkills = extraction.suggestedSkills.filter(
      (item) => !currentSkills.some((current) => current.toLocaleLowerCase() === item.toLocaleLowerCase()),
    );
    const suggestedCertifications = extraction.suggestedCertifications.filter(
      (item) => !currentCertifications.some((current) => current.toLocaleLowerCase() === item.toLocaleLowerCase()),
    );

    return (
      <div className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50/60 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
              <FileCheck2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{extraction.fileName}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {extraction.wordCount.toLocaleString()} words{extraction.pageCount ? ` · ${extraction.pageCount} pages` : ""} · ready to review
              </p>
            </div>
          </div>
          <button type="button" onClick={reset} className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700" aria-label="Choose a different résumé">
            <X className="h-4 w-4" />
          </button>
        </div>

        {(suggestedSkills.length > 0 || suggestedCertifications.length > 0 || extraction.suggestedYearsExperience) && (
          <div className="rounded-xl border border-white bg-white/80 p-3.5">
            <p className="text-xs font-semibold text-slate-800">Suggested profile updates</p>
            <p className="mt-0.5 text-[11px] leading-4 text-slate-500">Keep only the details you recognise and want to add.</p>

            {suggestedSkills.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">Skills</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedSkills.map((skill) => {
                    const checked = selectedSkills.includes(skill);
                    return (
                      <button key={skill} type="button" onClick={() => toggleItem(skill, selectedSkills, setSelectedSkills)} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${checked ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500"}`} aria-pressed={checked}>
                        {checked && <Check className="h-3 w-3" />} {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {suggestedCertifications.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">Certifications</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedCertifications.map((certification) => {
                    const checked = selectedCertifications.includes(certification);
                    return (
                      <button key={certification} type="button" onClick={() => toggleItem(certification, selectedCertifications, setSelectedCertifications)} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${checked ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500"}`} aria-pressed={checked}>
                        {checked && <Check className="h-3 w-3" />} {certification}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {extraction.suggestedYearsExperience && (
              <label className="mt-3 block text-[11px] font-semibold text-slate-600">
                Years of experience
                <input type="number" min="0" max="50" value={yearsExperience} onChange={(event) => setYearsExperience(Number(event.target.value))} className="ml-2 w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </label>
            )}
          </div>
        )}

        <label className="block text-xs font-semibold text-slate-700">
          Extracted résumé text
          <textarea rows={8} value={reviewText} onChange={(event) => setReviewText(event.target.value)} className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </label>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5 text-[10px] leading-4 text-slate-500"><LockKeyhole className="h-3.5 w-3.5" /> Nothing is saved until you apply and save your profile.</p>
          <button type="button" onClick={applyReview} disabled={!reviewText.trim()} className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            Apply reviewed details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-6 text-center transition ${status === "extracting" ? "border-blue-300 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/60"}`}>
        <input ref={inputRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" disabled={status === "extracting"} onChange={(event) => processFile(event.target.files?.[0])} />
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
          {status === "extracting" ? <LoaderCircle className="h-5 w-5 animate-spin" /> : status === "applied" ? <Check className="h-5 w-5 text-emerald-600" /> : <FileUp className="h-5 w-5" />}
        </span>
        <span className="mt-3 text-sm font-semibold text-slate-800">
          {status === "extracting" ? "Reading your résumé…" : status === "applied" ? "Reviewed details applied" : "Choose a PDF or DOCX résumé"}
        </span>
        <span className="mt-1 text-xs text-slate-500">
          {status === "applied" ? "Choose another file to replace the extracted details." : "Up to 10 MB. The file stays on this device."}
        </span>
      </label>

      {status === "applied" && (
        <button type="button" onClick={reset} className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800">
          <RotateCcw className="h-3.5 w-3.5" /> Review another résumé
        </button>
      )}

      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700">{error}</p>}
    </div>
  );
}
