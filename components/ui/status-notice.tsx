import React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type StatusTone = "success" | "error" | "info";

interface StatusNoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: StatusTone;
  title?: string;
}

const tones: Record<StatusTone, { frame: string; icon: string; Icon: typeof CheckCircle2 }> = {
  success: {
    frame: "border-emerald-200 bg-emerald-50 text-emerald-900",
    icon: "text-emerald-700",
    Icon: CheckCircle2,
  },
  error: {
    frame: "border-rose-200 bg-rose-50 text-rose-900",
    icon: "text-rose-700",
    Icon: AlertCircle,
  },
  info: {
    frame: "border-blue-200 bg-blue-50 text-blue-900",
    icon: "text-blue-700",
    Icon: Info,
  },
};

export function StatusNotice({ tone = "info", title, className = "", children, ...props }: StatusNoticeProps) {
  const { frame, icon, Icon } = tones[tone];

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ${frame} ${className}`}
      {...props}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${icon}`} aria-hidden="true" />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? "mt-0.5 text-xs leading-5 opacity-80" : "text-xs font-semibold leading-5"}>{children}</div>
      </div>
    </div>
  );
}
