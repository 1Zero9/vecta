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
  bodyClassName?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "drawer";
  placement?: "center" | "right";
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
  "2xl": "max-w-5xl",
  drawer: "max-w-xl",
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function DialogShell({ titleId, title, description, icon, children, footer, onClose, closeLabel = "Close dialog", className = "", bodyClassName = "", size = "sm", placement = "center" }: DialogShellProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);
  const descriptionId = description ? `${titleId}-description` : undefined;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    if (!dialogRef.current?.contains(document.activeElement)) dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex bg-slate-900/30 backdrop-blur-sm ${placement === "right" ? "items-stretch justify-end" : "items-center justify-center p-4"}`}>
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={`flex w-full ${sizes[size]} flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl outline-none ${placement === "right" ? "h-full max-h-none rounded-none border-y-0 border-r-0" : "max-h-[92vh] rounded-3xl"} ${className}`}
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
        <div className={`min-h-0 flex-1 overflow-y-auto p-5 sm:p-6 ${bodyClassName}`}>{children}</div>
        {footer && <footer className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">{footer}</footer>}
      </section>
    </div>
  );
}
