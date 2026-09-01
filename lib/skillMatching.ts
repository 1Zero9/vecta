import { SkillMatchDecision, SkillMatchOverride } from "./types";
import { SKILL_TAXONOMY } from "./skillTaxonomy";

export type SkillPriority = "required" | "preferred";

export interface SkillRequirementMatch {
  requirement: string;
  priority: SkillPriority;
  matched: boolean;
  matchedBy?: string;
  normalizedAs?: string;
  userDecision?: SkillMatchDecision;
}

export function applySkillMatchOverrides(
  matches: SkillRequirementMatch[],
  overrides: SkillMatchOverride[],
  jobId: string,
): SkillRequirementMatch[] {
  return matches.map((match) => {
    const override = overrides.find((candidate) =>
      candidate.job_id === jobId
      && candidate.priority === match.priority
      && candidate.requirement.trim().toLocaleLowerCase() === match.requirement.trim().toLocaleLowerCase(),
    );
    if (!override) return match;

    return {
      ...match,
      matched: override.decision === "include",
      matchedBy: override.decision === "include" ? "User correction" : undefined,
      normalizedAs: override.decision === "include" ? match.normalizedAs : undefined,
      userDecision: override.decision,
    };
  });
}

const SKILL_ALIASES: Record<string, readonly string[]> = SKILL_TAXONOMY.aliases;

function normalizeLabel(value: string): string {
  return value
    .normalize("NFKD")
    .toLocaleLowerCase()
    .replace(/&/g, " and ")
    .replace(/[-–—_]/g, " ")
    .replace(/[^a-z0-9+#.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const aliasToCanonical = new Map<string, string>();
for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
  aliasToCanonical.set(normalizeLabel(canonical), canonical);
  aliases.forEach((alias) => aliasToCanonical.set(normalizeLabel(alias), canonical));
}

function splitAlternatives(value: string): string[] {
  const normalizedWhole = normalizeLabel(value);
  if (aliasToCanonical.has(normalizedWhole)) return [normalizedWhole];

  return value
    .replace(/\(([^)]+)\)/g, " / $1")
    .split(/\s+\/\s+|\s*,\s*|\s+\bor\b\s+/i)
    .map(normalizeLabel)
    .filter(Boolean);
}

export function getSkillConcepts(value: string): string[] {
  return Array.from(
    new Set(
      splitAlternatives(value).map((candidate) => aliasToCanonical.get(candidate) ?? candidate),
    ),
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resumeContainsConcept(resumeText: string, concept: string): boolean {
  const normalizedResume = normalizeLabel(resumeText);
  const aliases = SKILL_ALIASES[concept] ?? [concept];

  return aliases.some((alias) => {
    const normalizedAlias = normalizeLabel(alias);
    return new RegExp(`(^|[^a-z0-9+#])${escapeRegExp(normalizedAlias)}([^a-z0-9+#]|$)`, "i").test(normalizedResume);
  });
}

export function matchSkillRequirement(
  requirement: string,
  profileSkills: string[],
  resumeText: string,
  priority: SkillPriority,
): SkillRequirementMatch {
  const requirementConcepts = getSkillConcepts(requirement);

  for (const profileSkill of profileSkills) {
    const profileConcepts = getSkillConcepts(profileSkill);
    const normalizedAs = requirementConcepts.find((concept) => profileConcepts.includes(concept));
    if (normalizedAs) {
      return { requirement, priority, matched: true, matchedBy: profileSkill, normalizedAs };
    }
  }

  const normalizedAs = requirementConcepts.find((concept) => resumeContainsConcept(resumeText, concept));
  return normalizedAs
    ? { requirement, priority, matched: true, matchedBy: "Résumé text", normalizedAs }
    : { requirement, priority, matched: false };
}

export function skillsOverlap(first: string, second: string): boolean {
  const secondConcepts = new Set(getSkillConcepts(second));
  return getSkillConcepts(first).some((concept) => secondConcepts.has(concept));
}
