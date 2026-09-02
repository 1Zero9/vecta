"use client";

import React, { useState } from "react";
import { Job, CandidateProfile } from "@/lib/types";
import { 
  generateTailoredCoverLetter, 
  generateTailoredResumeBullets, 
  generateStarQuestionPack 
} from "@/lib/copilotEngine";
import confetti from "canvas-confetti";
import { 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  FileText, 
  Zap, 
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";

interface CopilotModalProps {
  job: Job | null;
  profile: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "tailor" | "interview";
}

export function CopilotModal({
  job,
  profile,
  isOpen,
  onClose,
  initialMode = "tailor",
}: CopilotModalProps) {
  const [mode, setMode] = useState<"tailor" | "interview">(initialMode);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen || !job) return null;

  const coverLetter = generateTailoredCoverLetter(profile, job);
  const resumeBullets = generateTailoredResumeBullets(profile, job);
  const starPack = generateStarQuestionPack(job);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.85 }
    });
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadMarkdown = () => {
    const content = `# Application Pack: ${job.title} at ${job.company_name}
Prepared with Vecta's deterministic templates. Review every statement and replace bracketed prompts before use.

## Cover Letter Draft
${coverLetter}

---

## Evidence-Based Résumé Prompts
${resumeBullets.map((b) => `• ${b}`).join("\n")}

---

## STAR Interview Preparation Pack
${starPack
  .map(
    (s, idx) => `
### Question ${idx + 1}: ${s.question}
**Category**: ${s.category}
- **Situation**: ${s.situation}
- **Task**: ${s.task}
- **Action**: ${s.action}
- **Result**: ${s.result}
- **Pro Tip**: ${s.pro_tip}
`
  )
  .join("\n")}
`;

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Vecta_${job.company_name.replace(/\s+/g, "_")}_Application_Pack.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DialogShell
      titleId="application-draft-title"
      title="Application preparation"
      description={`${job.title} · ${job.company_name} · ${job.domain}`}
      icon={<Sparkles className="h-5 w-5" />}
      onClose={onClose}
      closeLabel="Close application preparation"
      size="xl"
      bodyClassName="p-0 sm:p-0"
      footer={(
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline">
            Open the listed application link <CheckCircle2 className="h-4 w-4" />
          </a>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleDownloadMarkdown} title="Download full application bundle as Markdown"><Download className="h-4 w-4 text-emerald-700" /> Download .md</Button>
            <Button size="sm" variant="primary" onClick={onClose}>Done</Button>
          </div>
        </div>
      )}
    >

        {/* Tab Switcher */}
        <div role="tablist" aria-label="Application preparation views" className="flex items-center overflow-x-auto px-5 pt-4 sm:px-6 border-b border-slate-200 bg-slate-50 gap-4">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "tailor"}
            onClick={() => setMode("tailor")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
              mode === "tailor"
                ? "border-emerald-400 text-emerald-700"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Cover Letter & Résumé Draft</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === "interview"}
            onClick={() => setMode("interview")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
              mode === "interview"
                ? "border-amber-400 text-amber-700"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>STAR Interview Prep Pack</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {mode === "tailor" ? (
            <div className="space-y-6">
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
                These are deterministic templates, not AI-generated or employer-verified content. Replace bracketed prompts and keep only statements supported by your experience.
              </p>
              
              {/* Cover Letter Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-600 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>Cover Letter Draft</span>
                  </span>
                  <button
                    onClick={() => handleCopy(coverLetter, "letter")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-all"
                  >
                    {copiedType === "letter" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Letter</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 leading-relaxed font-mono text-xs sm:text-[13px] whitespace-pre-wrap selection:bg-emerald-500 selection:text-slate-950">
                  {coverLetter}
                </div>
              </div>

              {/* Evidence-based resume prompts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-600 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-700" />
                    <span>Evidence-Based Résumé Prompts</span>
                  </span>
                  <button
                    onClick={() => handleCopy(resumeBullets.join("\n"), "bullets")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-all"
                  >
                    {copiedType === "bullets" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Bullets</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  {resumeBullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="text-sky-700 font-bold">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Role-Specific Interview Prompts
                  </h4>
                  <p className="text-xs text-slate-400">
                    Use your own examples to prepare for likely {job.domain} questions; Vecta does not invent an answer for you.
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleCopy(
                      starPack
                        .map(
                          (s) =>
                            `Q: ${s.question}\nSituation: ${s.situation}\nTask: ${s.task}\nAction: ${s.action}\nResult: ${s.result}\nPro-Tip: ${s.pro_tip}`
                        )
                        .join("\n\n"),
                      "star"
                    )
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-all"
                >
                  {copiedType === "star" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Prep Pack</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {starPack.map((pack, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-amber-700 font-bold text-xs uppercase tracking-wider font-mono">
                        Question {idx + 1} · {pack.category}
                      </span>
                    </div>

                    <h5 className="text-sm sm:text-base font-extrabold text-slate-900">
                      &ldquo;{pack.question}&rdquo;
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 rounded-xl bg-white border border-slate-200/70 space-y-1">
                        <span className="font-bold text-sky-700 uppercase tracking-wider block">
                          [S] Situation
                        </span>
                        <p className="text-slate-600 leading-relaxed">{pack.situation}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200/70 space-y-1">
                        <span className="font-bold text-indigo-700 uppercase tracking-wider block">
                          [T] Task
                        </span>
                        <p className="text-slate-600 leading-relaxed">{pack.task}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200/70 space-y-1">
                        <span className="font-bold text-emerald-700 uppercase tracking-wider block">
                          [A] Your Action
                        </span>
                        <p className="text-slate-600 leading-relaxed">{pack.action}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200/70 space-y-1">
                        <span className="font-bold text-amber-700 uppercase tracking-wider block">
                          [R] Verified Result
                        </span>
                        <p className="text-slate-600 leading-relaxed">{pack.result}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-500/20 text-xs text-amber-700 flex items-start gap-2">
                      <Zap className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-800">Interview Pro-Tip:</strong> {pack.pro_tip}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

    </DialogShell>
  );
}
