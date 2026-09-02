"use client";

import React, { useState } from "react";
import { ShieldCheck, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConsentBannerProps {
  onAcceptAll: () => void;
  onOpenGovernance: () => void;
}

export function ConsentBanner({
  onAcceptAll,
  onOpenGovernance,
}: ConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleAccept = () => {
    onAcceptAll();
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-50 animate-in slide-in-from-bottom duration-300">
      <div className="glass-panel rounded-2xl p-5 border border-slate-200 shadow-xl bg-white backdrop-blur-xl space-y-3">
        
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <span>Prototype privacy and data notice</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Candidate data is primarily stored on this device.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500"
            aria-label="Dismiss privacy notice"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed">
          Vecta uses browser storage for your profile and workspace. Fit estimates and application drafts are deterministic aids, not hiring decisions or externally generated AI content. This preview is not a claim of legal or regulatory compliance.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200 text-xs">
          <Button
            onClick={onOpenGovernance}
            variant="ghost"
            size="sm"
            className="text-sky-700"
          >
            <span>Review data controls and boundaries</span>
          </Button>

          <Button
            onClick={handleAccept}
            variant="primary"
            size="sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Continue</span>
          </Button>
        </div>

      </div>
    </div>
  );
}
