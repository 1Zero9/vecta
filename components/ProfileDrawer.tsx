"use client";

import React, { useState } from "react";
import { CandidateProfile, DomainType, WorkMode } from "@/lib/types";
import { 
  X, 
  UserCheck, 
  Save, 
  Sparkles, 
  Award, 
  FileText, 
  Banknote, 
  CheckCircle2,
  Plus
} from "lucide-react";

interface ProfileDrawerProps {
  profile: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: CandidateProfile) => void;
}

export function ProfileDrawer({
  profile,
  isOpen,
  onClose,
  onSaveProfile,
}: ProfileDrawerProps) {
  const [formData, setFormData] = useState<CandidateProfile>(profile);
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync profile when opened
  React.useEffect(() => {
    setFormData(profile);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleAddCert = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    if (!certInput.trim()) return;
    if (!formData.certifications.includes(certInput.trim())) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, certInput.trim()],
      });
    }
    setCertInput("");
  };

  const handleRemoveCert = (certToRemove: string) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((c) => c !== certToRemove),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm">
      <div className="bg-white border-l border-slate-200 max-w-xl w-full h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#245e49] text-white font-black flex items-center justify-center shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Candidate Profile & Vector Settings
              </h3>
              <p className="text-xs text-slate-400">
                Powers real-time ATS match scoring and tailored application drafting.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">
                Current / Target Title
              </label>
              <input
                type="text"
                required
                value={formData.current_title}
                onChange={(e) => setFormData({ ...formData, current_title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">
                Primary Vector
              </label>
              <select
                value={formData.primary_domain}
                onChange={(e) => setFormData({ ...formData, primary_domain: e.target.value as DomainType })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
              >
                <option value="AI">AI & ML</option>
                <option value="Security">Cybersecurity</option>
                <option value="Governance">Governance & GRC</option>
                <option value="IT">IT Infrastructure</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">
                Years Experience
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={formData.years_experience}
                onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase tracking-wider mb-1">
                Target Salary (£)
              </label>
              <input
                type="number"
                step="5000"
                value={formData.target_salary_min || 100000}
                onChange={(e) => setFormData({ ...formData, target_salary_min: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
              />
            </div>
          </div>

          {/* Technical Skills Manager */}
          <div className="space-y-2">
            <label className="block text-slate-600 font-bold uppercase tracking-wider">
              Core Technical Skills ({formData.skills.length})
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Type skill & press Enter (e.g. PyTorch, vLLM, ISO 27001, Kubernetes)..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-1.5 border border-slate-200/70"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Certifications Manager */}
          <div className="space-y-2">
            <label className="block text-slate-600 font-bold uppercase tracking-wider">
              Certifications & Accreditations ({formData.certifications.length})
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                onKeyDown={handleAddCert}
                placeholder="Type cert & press Enter (e.g. CISSP, AWS ML, CIPP/E, CKA)..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddCert}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.certifications.map((cert) => (
                <span
                  key={cert}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 flex items-center gap-1.5 border border-amber-500/20"
                >
                  <span>{cert}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCert(cert)}
                    className="text-amber-700 hover:text-rose-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Resume Raw Text for ATS Deep Scanning */}
          <div className="space-y-1.5">
            <label className="block text-slate-600 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Resume & Career History (For Deep ATS Keyword Parsing)</span>
              <span className="text-[10px] text-emerald-700 font-mono">Real-time vector synced</span>
            </label>
            <textarea
              rows={6}
              value={formData.resume_text}
              onChange={(e) => setFormData({ ...formData, resume_text: e.target.value })}
              placeholder="Paste your CV text, project highlights, or key deliverables here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-600 font-mono text-xs focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Submit / Save Button */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Changes persist in browser local storage.
            </span>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#245e49] hover:bg-[#1d4d3c] text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Vector Profile</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
