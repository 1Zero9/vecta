"use client";

import React, { useState } from "react";
import { Company, DomainType, ScaleTier } from "@/lib/types";
import { 
  Building2, 
  ExternalLink, 
  Star, 
  ChevronRight, 
  Search, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  Flame,
  Layers,
  MapPin,
  Lock,
  Globe
} from "lucide-react";

interface RadarTableProps {
  companies: Company[];
  favouriteCompanyIds: string[];
  onToggleFavourite: (companyId: string) => void;
  activeDomain: DomainType | "ALL";
  setActiveDomain: (d: DomainType | "ALL") => void;
}

export function RadarTable({
  companies,
  favouriteCompanyIds,
  onToggleFavourite,
  activeDomain,
  setActiveDomain,
}: RadarTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScale, setSelectedScale] = useState<string>("ALL");
  const [selectedFunding, setSelectedFunding] = useState<string>("ALL");
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [expandedCompanyIds, setExpandedCompanyIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedCompanyIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredCompanies = companies.filter((c) => {
    if (activeDomain !== "ALL" && c.domain !== activeDomain) return false;
    if (selectedScale !== "ALL" && !c.scale_tier.includes(selectedScale)) return false;
    if (selectedFunding !== "ALL" && !c.funding.includes(selectedFunding)) return false;
    if (showFavouritesOnly && !favouriteCompanyIds.includes(c.id)) return false;

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const nameMatch = c.name.toLowerCase().includes(q);
      const taglineMatch = c.tagline.toLowerCase().includes(q);
      const techMatch = c.tech_stack.some((t) => t.toLowerCase().includes(q));
      const compMatch = c.compliance_tags.some((comp) => comp.toLowerCase().includes(q));
      const leaderMatch = c.leadership.some((l) => l.toLowerCase().includes(q));
      if (!nameMatch && !taglineMatch && !techMatch && !compMatch && !leaderMatch) {
        return false;
      }
    }

    return true;
  });

  const exportCSV = () => {
    const headers = ["Name", "Domain", "Scale Tier", "Funding", "Location", "ATS Type", "Compliance", "Tech Stack", "Open Roles", "Careers URL"];
    const rows = filteredCompanies.map((c) => [
      `"${c.name}"`,
      `"${c.domain}"`,
      `"${c.scale_tier}"`,
      `"${c.funding}"`,
      `"${c.location}"`,
      `"${c.ats_type}"`,
      `"${c.compliance_tags.join(", ")}"`,
      `"${c.tech_stack.join(", ")}"`,
      c.open_roles_count,
      `"${c.careers_url}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vecta_tech_radar_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDomainBadge = (domain: DomainType) => {
    switch (domain) {
      case "AI":
        return <span className="badge-ai px-2.5 py-0.5 rounded-lg text-xs font-bold">AI / GenAI</span>;
      case "Security":
        return <span className="badge-security px-2.5 py-0.5 rounded-lg text-xs font-bold">Security</span>;
      case "Governance":
        return <span className="badge-governance px-2.5 py-0.5 rounded-lg text-xs font-bold">Governance</span>;
      case "IT":
        return <span className="badge-it px-2.5 py-0.5 rounded-lg text-xs font-bold">IT & Cloud</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Toolbar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 space-y-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies by name, tech stack, compliance framework, or leadership..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm sm:text-base transition-all"
            />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-2xl text-xs sm:text-sm font-semibold border border-slate-200 shadow-sm transition-all shrink-0"
            title="Export directory as CSV"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Export CSV</span>
          </button>

        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/70">
          
          {/* Domain Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveDomain("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDomain === "ALL"
                  ? "bg-white text-slate-950 shadow-md"
                  : "bg-slate-100 text-slate-400 hover:text-slate-900"
              }`}
            >
              All Domains
            </button>
            <button
              onClick={() => setActiveDomain("AI")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDomain === "AI"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-slate-100 text-sky-700 hover:bg-sky-50"
              }`}
            >
              AI Labs
            </button>
            <button
              onClick={() => setActiveDomain("Security")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDomain === "Security"
                  ? "bg-rose-500 text-slate-900 shadow-md shadow-rose-500/20"
                  : "bg-slate-100 text-rose-700 hover:bg-rose-100"
              }`}
            >
              Cybersecurity
            </button>
            <button
              onClick={() => setActiveDomain("Governance")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDomain === "Governance"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-100 text-amber-700 hover:bg-amber-50"
              }`}
            >
              Governance & GRC
            </button>
            <button
              onClick={() => setActiveDomain("IT")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeDomain === "IT"
                  ? "bg-indigo-500 text-slate-900 shadow-md shadow-indigo-500/20"
                  : "bg-slate-100 text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              Enterprise IT
            </button>
          </div>

          {/* Scale & Funding Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedScale}
              onChange={(e) => setSelectedScale(e.target.value)}
              className="bg-white border border-slate-200 text-slate-600 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Scale Tiers</option>
              <option value="Startup">Startup (1-20)</option>
              <option value="Scaleup">Scaleup (20-100)</option>
              <option value="Mid-Market">Mid-Market (100-500)</option>
              <option value="Enterprise">Enterprise / FDI (500+)</option>
            </select>

            <select
              value={selectedFunding}
              onChange={(e) => setSelectedFunding(e.target.value)}
              className="bg-white border border-slate-200 text-slate-600 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Ownership Types</option>
              <option value="VC-backed">VC-backed</option>
              <option value="PE-backed">PE-backed</option>
              <option value="Bootstrapped">Bootstrapped</option>
              <option value="Public">Public / Corporate</option>
            </select>

            {/* Favourites Only */}
            <button
              onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                showFavouritesOnly
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showFavouritesOnly ? "fill-slate-950" : ""}`} />
              <span>Starred ({favouriteCompanyIds.length})</span>
            </button>
          </div>

        </div>

      </div>

      {/* Company Radar Table (Desktop & Tablets) */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-white text-slate-400 font-bold uppercase tracking-wider text-xs">
                <th className="py-4 px-3 w-10 text-center"></th>
                <th className="py-4 px-3 w-10 text-center">
                  <Star className="w-4 h-4 text-slate-500 mx-auto" />
                </th>
                <th className="py-4 px-5">Company & Mission</th>
                <th className="py-4 px-4">Domain</th>
                <th className="py-4 px-4">Scale</th>
                <th className="py-4 px-4">Compliance / Badges</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4 text-center">Live Roles</th>
                <th className="py-4 px-5 text-right">Careers Portal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400">
                    No companies match the current filter selection.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => {
                  const isExpanded = expandedCompanyIds.has(company.id);
                  const isFav = favouriteCompanyIds.includes(company.id);

                  return (
                    <React.Fragment key={company.id}>
                      <tr className="hover:bg-slate-50 transition-colors group">
                        
                        {/* Expand Chevron */}
                        <td className="py-4 px-3 text-center">
                          <button
                            onClick={() => toggleExpand(company.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                            title="Toggle company deep dive"
                          >
                            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90 text-emerald-700" : ""}`} />
                          </button>
                        </td>

                        {/* Favourite Star */}
                        <td className="py-4 px-3 text-center">
                          <button
                            onClick={() => onToggleFavourite(company.id)}
                            className="p-1 text-slate-500 hover:text-amber-700 transition-colors"
                            title={isFav ? "Remove favourite" : "Star company"}
                          >
                            <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-700" : ""}`} />
                          </button>
                        </td>

                        {/* Company Name & Tagline */}
                        <td className="py-4 px-5">
                          <div className="font-extrabold text-slate-900 text-base group-hover:text-blue-700 transition-colors flex items-center gap-2">
                            <span>{company.name}</span>
                            {company.featured && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 text-[10px] font-mono uppercase font-bold border border-emerald-500/30">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 max-w-md line-clamp-1">
                            {company.tagline}
                          </div>
                        </td>

                        {/* Domain Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {getDomainBadge(company.domain)}
                        </td>

                        {/* Scale Tier */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/70 text-slate-600 text-xs font-medium">
                            {company.scale_tier}
                          </span>
                        </td>

                        {/* Compliance Badges */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {company.compliance_tags.slice(0, 2).map((comp, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-500/30 text-emerald-700 text-[11px] font-mono"
                              >
                                {comp}
                              </span>
                            ))}
                            {company.compliance_tags.length > 2 && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 text-[10px] font-mono">
                                +{company.compliance_tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600">
                          {company.location.split("/")[0]}
                        </td>

                        {/* Open Roles Count */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 font-mono font-bold text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            {company.open_roles_count} live
                          </span>
                        </td>

                        {/* Careers Links */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <a
                            href={company.careers_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-emerald-700 text-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm group/link"
                          >
                            <span>{company.ats_type}</span>
                            <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                          </a>
                        </td>

                      </tr>

                      {/* Expandable Company Deep-Dive Drawer */}
                      {isExpanded && (
                        <tr className="bg-slate-50 border-y border-slate-200/70">
                          <td colSpan={9} className="p-6 space-y-4">
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              
                              {/* Overview & Mission */}
                              <div className="space-y-2 md:col-span-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                  Company Overview & Engineering Mission
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                  {company.description}
                                </p>

                                <div className="pt-2">
                                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                    Tech Stack & Infrastructure
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {company.tech_stack.map((tech, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-medium border border-slate-200"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Leadership & Compliance Meta */}
                              <div className="space-y-3 p-4 rounded-2xl bg-white border border-slate-200 text-xs">
                                <div>
                                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    Technical Leadership
                                  </span>
                                  <div className="space-y-1 text-slate-700 font-medium">
                                    {company.leadership.map((leader, idx) => (
                                      <div key={idx} className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                        <span>{leader}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-slate-200/70">
                                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                    Full Compliance & Governance
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {company.compliance_tags.map((comp, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] border border-emerald-500/20"
                                      >
                                        {comp}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                                  <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sky-700 hover:underline flex items-center gap-1 font-semibold"
                                  >
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>Website</span>
                                  </a>
                                  <a
                                    href={company.careers_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                                  >
                                    <span>Direct ATS Portal</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>

                              </div>

                            </div>

                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
