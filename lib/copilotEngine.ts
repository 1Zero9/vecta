import { CandidateProfile, DomainType, Job, StarQuestionPack } from "./types";

function relevantSkills(profile: CandidateProfile, job: Job): string[] {
  const requirements = new Set([...job.req_skills, ...job.preferred_skills].map((skill) => skill.toLocaleLowerCase()));
  return profile.skills.filter((skill) => requirements.has(skill.toLocaleLowerCase())).slice(0, 4);
}

function relevantEvidence(profile: CandidateProfile, job: Job) {
  const requirements = new Set([...job.req_skills, ...job.preferred_skills].map((skill) => skill.toLocaleLowerCase()));
  return (profile.evidence ?? [])
    .filter((item) => item.claims.some((claim) => requirements.has(claim.toLocaleLowerCase())))
    .slice(0, 4);
}

export function generateTailoredCoverLetter(profile: CandidateProfile, job: Job): string {
  const skills = relevantSkills(profile, job);
  const skillText = skills.length > 0 ? skills.join(", ") : "[add the verified skills that best match this role]";
  const evidence = relevantEvidence(profile, job).slice(0, 2);
  const evidenceText = evidence.length > 0
    ? evidence.map((item) => `• ${item.title}: ${item.description}`).join("\n")
    : "• [Add a verified example from your experience, including your action and its outcome.]";

  return `Dear Hiring Team at ${job.company_name},

I am applying for the ${job.title} position. My background as ${profile.current_title || "[your current or most recent role]"} includes experience with ${skillText}, which aligns with priorities described for this role.

Relevant evidence from my profile:
${evidenceText}

I am interested in discussing how this experience could support ${job.company_name}'s work in ${job.subdomain}. Before sending, I will check every statement against my own experience and replace any bracketed guidance with a specific, truthful example.

Thank you for your consideration.

Sincerely,
${profile.full_name || "[your name]"}`;
}

export function generateTailoredResumeBullets(profile: CandidateProfile, job: Job): string[] {
  const evidence = relevantEvidence(profile, job).filter((item) => item.description.trim());
  if (evidence.length > 0) {
    return evidence.map((item) => `${item.description} [Review wording and add only metrics you can verify.]`);
  }

  const prompts = [...job.req_skills, ...job.preferred_skills].slice(0, 4);
  return (prompts.length > 0 ? prompts : [job.subdomain]).map(
    (skill) => `[Add a verified example showing how you used ${skill}; state your action, the context, and a measurable result only if you can support it.]`,
  );
}

const interviewQuestions: Record<DomainType, Array<Pick<StarQuestionPack, "question" | "category" | "pro_tip">>> = {
  AI: [
    {
      question: "Describe a time you diagnosed quality, latency, or reliability problems in an AI or data system.",
      category: "Incident / Crisis",
      pro_tip: "Use measurements you can verify and explain how you separated symptoms from root cause.",
    },
    {
      question: "How have you designed an automated or agentic workflow with appropriate safety and cost controls?",
      category: "Technical / Domain",
      pro_tip: "Discuss the controls you actually implemented; do not imply production experience you do not have.",
    },
  ],
  Security: [
    {
      question: "Tell me about a security incident or serious vulnerability you helped investigate or contain.",
      category: "Incident / Crisis",
      pro_tip: "Be precise about your role, the timeline, and what you personally verified.",
    },
    {
      question: "How have you introduced security guardrails while preserving engineering delivery speed?",
      category: "Leadership / Governance",
      pro_tip: "Show how you measured both risk reduction and developer impact.",
    },
  ],
  Governance: [
    {
      question: "Describe how you prepared a team or system for a complex audit or regulatory review.",
      category: "Leadership / Governance",
      pro_tip: "Name only frameworks, findings, and outcomes you can substantiate.",
    },
    {
      question: "How did you respond when commercial pressure conflicted with a material risk finding?",
      category: "Problem Solving",
      pro_tip: "Explain how you framed options, ownership, and residual risk for decision-makers.",
    },
  ],
  IT: [
    {
      question: "Walk me through a significant service disruption and your role in restoring it.",
      category: "Incident / Crisis",
      pro_tip: "Use your real recovery targets and results, and distinguish team actions from your own.",
    },
    {
      question: "How have you modernized a legacy platform while protecting service continuity?",
      category: "Technical / Domain",
      pro_tip: "Cover migration sequencing, rollback, stakeholder communication, and verified outcomes.",
    },
  ],
};

export function generateStarQuestionPack(job: Job): StarQuestionPack[] {
  return interviewQuestions[job.domain].map((item) => ({
    ...item,
    situation: "[Describe the real context, constraints, and people affected.]",
    task: "[State your responsibility and the outcome you were accountable for.]",
    action: "[Explain the steps you personally took and why you chose them.]",
    result: "[Give the verified outcome, learning, or follow-up. Add metrics only when you can support them.]",
  }));
}
