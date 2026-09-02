"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DialogShellProps {
  titleId: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  closeLabel?: string;
  className?: string;
}

export function DialogShell({ titleId, title, description, icon, children, footer, onClose, closeLabel = "Close dialog", className = "" }: DialogShellProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);
  const descriptionId = description ? `${titleId}-description` : undefined;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handleKeyDown);
    if (!dialogRef.current?.contains(document.activeElement)) dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={`flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl outline-none ${className}`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            {icon && <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">{icon}</span>}
            <div>
              <h2 id={titleId} className="text-base font-semibold text-slate-900">{title}</h2>
              {description && <p id={descriptionId} className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label={closeLabel} className="-mr-2 -mt-2 h-9 w-9">
            <X className="h-4 w-4" />
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">{children}</div>
        {footer && <footer className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">{footer}</footer>}
      </section>
    </div>
  );
}
