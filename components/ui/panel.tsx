import React from "react";

export function Panel({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white/92 shadow-[0_14px_38px_rgba(15,23,42,0.055)] backdrop-blur-sm ${className}`}
      {...props}
    />
  );
}

