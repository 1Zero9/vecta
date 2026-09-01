"use client";

import React, { useState } from "react";
import { ConsentSettings } from "@/lib/types";
import { ShieldCheck, Sparkles, Lock, X, Check } from "lucide-react";

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
                <span>Privacy, GDPR & EU AI Act Notice</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Vecta operates local-first data processing with human-in-the-loop AI assistance.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-500 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed">
          We use strictly essential local storage to calculate your vector match scores and draft tailored applications. No automated candidate disqualifications or biometric profiling are conducted.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200 text-xs">
          <button
            onClick={onOpenGovernance}
            className="text-sky-700 hover:underline font-semibold text-[11px] flex items-center gap-1"
          >
            <span>Read EU AI Act & GDPR Charter</span>
          </button>

          <button
            onClick={handleAccept}
            className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Acknowledge & Continue</span>
          </button>
        </div>

      </div>
    </div>
  );
}
