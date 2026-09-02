import React from "react";

interface FieldProps {
  id: string;
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export function Field({ id, label, children, hint, error, required, className = "" }: FieldProps) {
  const detailId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
        {label}{required && <span className="ml-1 text-rose-600" aria-hidden="true">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? <p id={detailId} role="alert" className="mt-1.5 text-xs text-rose-700">{error}</p> : hint ? <p id={detailId} className="mt-1.5 text-xs leading-5 text-slate-500">{hint}</p> : null}
    </div>
  );
}

