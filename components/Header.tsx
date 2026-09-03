"use client";

import React from "react";
import Image from "next/image";
import { Briefcase, Compass, Users, Kanban, Search, Scale, ChevronDown } from "lucide-react";
import { UserAccount, WorkspaceTab } from "@/lib/types";
import { APP_VERSION, PRODUCT_STAGE } from "@/lib/version";

interface HeaderProps {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  currentUser: UserAccount;
  openCmdPalette: () => void;
  openUserManagement: () => void;
  openGovernance: () => void;
  totalJobs: number;
}

const navigation = [
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "radar", label: "Companies", icon: Compass },
  { id: "market", label: "Market", icon: Users },
  { id: "pipeline", label: "Pipeline", icon: Kanban },
] as const;

export function Header({
  activeTab,
  setActiveTab,
  currentUser,
  openCmdPalette,
  openUserManagement,
  openGovernance,
  totalJobs,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#F8FAFC]/92 backdrop-blur-xl">
      <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-4">
          <button onClick={() => setActiveTab("jobs")} className="flex items-center gap-3 text-left" aria-label="Go to jobs">
            <Image src="/vecta-mark.png" alt="" width={40} height={40} className="h-9 w-9 object-contain sm:hidden" priority />
            <Image src="/logo.png" alt="Vecta" width={120} height={40} className="hidden h-9 w-auto object-contain sm:block" priority />
            <span>
              <span className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-[-0.03em] text-slate-900 sm:hidden">Vecta</span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">{PRODUCT_STAGE} v{APP_VERSION}</span>
              </span>
              <span className="hidden text-xs text-slate-500 md:block">Your career, carried forward.</span>
            </span>
          </button>

          <nav className="hidden items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm lg:flex" aria-label="Primary navigation">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  activeTab === id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {id === "jobs" && <span className="rounded-full bg-white px-1.5 text-[10px] text-slate-500">{totalJobs}</span>}
              </button>
            ))}
            <button onClick={openGovernance} className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
              <Scale className="h-4 w-4" />
              Trust
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={openCmdPalette}
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-800"
              title="Search everything (Cmd+K)"
            >
              <Search className="h-4 w-4" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="hidden rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 sm:inline">⌘K</kbd>
            </button>

            <button
              onClick={openUserManagement}
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 pr-3 text-sm shadow-sm transition-colors hover:border-slate-300"
              title="Account and profiles"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">{currentUser.avatar}</span>
              <span className="hidden max-w-32 truncate font-medium text-slate-800 sm:block">{currentUser.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-slate-200/70 py-2 lg:hidden" aria-label="Mobile navigation">
          {navigation.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ${activeTab === id ? "bg-[#2563EB] text-white" : "text-slate-600 hover:bg-white"}`}
            >
              {label}{id === "jobs" ? ` ${totalJobs}` : ""}
            </button>
          ))}
          <button onClick={openGovernance} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white">Trust</button>
        </nav>
      </div>
    </header>
  );
}
