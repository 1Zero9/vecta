"use client";

import React, { useState } from "react";
import { ApplicationTrack, ApplicationStage, DomainType } from "@/lib/types";
import { 
  Kanban, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  FileEdit, 
  CheckCircle2, 
  Sparkles, 
  Download,
  ArrowRight,
  ArrowLeft,
  Banknote,
  Building
} from "lucide-react";

interface PipelineBoardProps {
  pipeline: ApplicationTrack[];
  onUpdateStage: (id: string, newStage: ApplicationStage) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onRemoveApplication: (id: string) => void;
  onAddCustomApplication: (app: Partial<ApplicationTrack>) => void;
}

const STAGES: { id: ApplicationStage; label: string; color: string; border: string }[] = [
  { id: "saved", label: "Saved / Evaluating", color: "bg-slate-100 text-slate-600", border: "border-slate-700" },
  { id: "drafting", label: "Drafting & Tailoring", color: "bg-sky-50 text-sky-700", border: "border-cyan-500/30" },
  { id: "applied", label: "Applied / Submitted", color: "bg-blue-950/60 text-blue-400", border: "border-blue-500/30" },
  { id: "screening", label: "Recruiter Screen", color: "bg-indigo-950/60 text-indigo-700", border: "border-indigo-500/30" },
  { id: "interviewing", label: "Technical Interview", color: "bg-amber-50 text-amber-700", border: "border-amber-500/30" },
  { id: "offer", label: "Offer / Negotiation", color: "bg-emerald-50 text-emerald-700", border: "border-emerald-500/40" },
];

export function PipelineBoard({
  pipeline,
  onUpdateStage,
  onUpdateNotes,
  onRemoveApplication,
  onAddCustomApplication,
}: PipelineBoardProps) {
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Application Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newDomain, setNewDomain] = useState<DomainType>("AI");
  const [newUrl, setNewUrl] = useState("");
  const [newSalary, setNewSalary] = useState("");

  const handleSaveNotes = (id: string) => {
    onUpdateNotes(id, tempNotes);
    setEditingNotesId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;

    onAddCustomApplication({
      job_title: newTitle,
      company_name: newCompany,
      domain: newDomain,
      apply_url: newUrl || "https://linkedin.com",
      salary_target: newSalary || undefined,
      stage: "saved",
      date_added: new Date().toISOString().slice(0, 10),
      date_updated: new Date().toISOString().slice(0, 10),
    });

    setNewTitle("");
    setNewCompany("");
    setNewUrl("");
    setNewSalary("");
    setShowAddModal(false);
  };

  const exportPipelineCSV = () => {
    const headers = ["Company", "Role", "Domain", "Stage", "Target Salary", "Date Added", "Notes", "Link"];
    const rows = pipeline.map((p) => [
      `"${p.company_name}"`,
      `"${p.job_title}"`,
      `"${p.domain}"`,
      `"${p.stage}"`,
      `"${p.salary_target || ""}"`,
      `"${p.date_added}"`,
      `"${(p.notes || "").replace(/"/g, '""')}"`,
      `"${p.apply_url || ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vecta_application_pipeline_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Pipeline Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-3xl p-6 border border-slate-200 shadow-lg">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Kanban className="w-6 h-6 text-emerald-700" />
            <span>Career Application Vector Pipeline</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track interview rounds, tailored CV notes, and target compensation across your active job search.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportPipelineCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {STAGES.map((col) => {
          const items = pipeline.filter((p) => p.stage === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-50 rounded-3xl p-3 sm:p-4 border border-slate-200 flex flex-col min-h-[500px] shadow-sm"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <span className={`text-[11px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded-lg border ${col.color} ${col.border}`}>
                  {col.label}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {items.length}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <div className="text-center py-12 text-slate-600 text-xs italic">
                    No active roles
                  </div>
                ) : (
                  items.map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/40 transition-all space-y-2.5 shadow-md group relative"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-sky-700">
                          {app.domain}
                        </span>
                        <button
                          onClick={() => onRemoveApplication(app.id)}
                          className="text-slate-500 hover:text-rose-700 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove from pipeline"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-xs leading-snug">
                          {app.job_title}
                        </h4>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Building className="w-3 h-3 text-emerald-700" />
                          <span className="truncate">{app.company_name}</span>
                        </div>
                      </div>

                      {app.salary_target && (
                        <div className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                          <Banknote className="w-3 h-3" />
                          <span>{app.salary_target}</span>
                        </div>
                      )}

                      {/* Notes Section */}
                      {editingNotesId === app.id ? (
                        <div className="space-y-1.5 pt-1">
                          <textarea
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            rows={2}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                            placeholder="Add interview notes, dates, or feedback..."
                          />
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-2 py-0.5 text-[10px] text-slate-400 hover:text-slate-900"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNotes(app.id)}
                              className="px-2 py-0.5 text-[10px] bg-emerald-700 text-white rounded font-bold"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingNotesId(app.id);
                            setTempNotes(app.notes || "");
                          }}
                          className="p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-400 hover:text-slate-700 cursor-pointer italic"
                          title="Click to edit notes"
                        >
                          {app.notes ? app.notes : "+ Click to add notes..."}
                        </div>
                      )}

                      {/* Stage Movement Controls */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 text-[10px]">
                        {app.apply_url && (
                          <a
                            href={app.apply_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-700 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}

                        <div className="flex items-center gap-1 ml-auto">
                          {/* Move Left */}
                          {col.id !== "saved" && (
                            <button
                              onClick={() => {
                                const currentIndex = STAGES.findIndex((s) => s.id === col.id);
                                if (currentIndex > 0) {
                                  onUpdateStage(app.id, STAGES[currentIndex - 1].id);
                                }
                              }}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                              title="Move back"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}

                          {/* Move Right */}
                          {col.id !== "offer" && (
                            <button
                              onClick={() => {
                                const currentIndex = STAGES.findIndex((s) => s.id === col.id);
                                if (currentIndex < STAGES.length - 1) {
                                  onUpdateStage(app.id, STAGES[currentIndex + 1].id);
                                }
                              }}
                              className="p-1 rounded bg-emerald-600/80 hover:bg-emerald-500 text-slate-950 font-bold"
                              title="Advance stage"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add Tracked Application</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lead Security Architect"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. CloudMesh Cyber"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Domain</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value as DomainType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  >
                    <option value="AI">AI & Machine Learning</option>
                    <option value="Security">Cybersecurity</option>
                    <option value="Governance">Governance & GRC</option>
                    <option value="IT">IT Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Salary</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="e.g. £120k"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Application URL</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold"
                >
                  Add to Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
