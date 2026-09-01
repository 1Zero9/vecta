export type SkillPriority = "required" | "preferred";

export interface SkillRequirementMatch {
  requirement: string;
  priority: SkillPriority;
  matched: boolean;
  matchedBy?: string;
  normalizedAs?: string;
}

const SKILL_ALIASES: Record<string, readonly string[]> = {
  "amazon web services": ["amazon web services", "aws", "aws cloud", "aws multi cloud", "aws security"],
  "microsoft azure": ["microsoft azure", "azure", "azure cloud"],
  "google cloud platform": ["google cloud platform", "google cloud", "gcp"],
  kubernetes: ["kubernetes", "k8s"],
  "continuous integration and delivery": ["continuous integration", "continuous delivery", "continuous deployment", "ci cd", "cicd"],
  "generative ai": ["generative ai", "genai", "gen ai", "large language models", "large language model", "llms", "llm"],
  "machine learning": ["machine learning", "ml"],
  "machine learning operations": ["machine learning operations", "mlops", "ml ops"],
  "artificial intelligence governance": ["artificial intelligence governance", "ai governance", "responsible ai", "responsible artificial intelligence"],
  "identity and access management": ["identity and access management", "identity access management", "iam"],
  "security information and event management": ["security information and event management", "siem"],
  "infrastructure as code": ["infrastructure as code", "iac"],
  "threat modelling": ["threat modelling", "threat modeling"],
  "risk management": ["risk management", "risk assessment", "risk assessments"],
  "stakeholder management": ["stakeholder management", "stakeholder engagement"],
  "incident response": ["incident response", "incident management"],
  "data governance": ["data governance", "information governance"],
};

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
