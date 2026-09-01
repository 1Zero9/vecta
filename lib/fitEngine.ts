import { CandidateProfile, Job, VectorMatchResult } from "./types";

export function evaluateVectorFit(profile: CandidateProfile, job: Job): VectorMatchResult {
  const profileSkillsLower = profile.skills.map((s) => s.toLowerCase().trim());
  const profileCertsLower = profile.certifications.map((c) => c.toLowerCase().trim());
  const resumeTextLower = (profile.resume_text || "").toLowerCase();

  // Combine job required & preferred skills
  const allJobSkills = [...job.req_skills, ...job.preferred_skills];
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  allJobSkills.forEach((skill) => {
    const sLower = skill.toLowerCase();
    const isDirectMatch = profileSkillsLower.some((ps) => ps.includes(sLower) || sLower.includes(ps));
    const isInResume = resumeTextLower.includes(sLower);

    if (isDirectMatch || isInResume) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // Certifications match
  const jobCerts = job.certifications || [];
  const matchingCerts: string[] = [];
  const missingCerts: string[] = [];

  jobCerts.forEach((cert) => {
    const cLower = cert.toLowerCase();
    const isDirectMatch = profileCertsLower.some((pc) => pc.includes(cLower) || cLower.includes(pc));
    const isInResume = resumeTextLower.includes(cLower);

    if (isDirectMatch || isInResume) {
      matchingCerts.push(cert);
    } else {
      missingCerts.push(cert);
    }
  });

  // Skills match score (weighted 50%)
  const totalSkillsCount = allJobSkills.length || 1;
  const skillsScore = Math.min(100, Math.round((matchingSkills.length / totalSkillsCount) * 100));

  // Domain alignment score (weighted 25%)
  let domainScore = 60;
  if (profile.primary_domain === job.domain) {
    domainScore = 100;
  } else if (
    (profile.primary_domain === "AI" && job.domain === "Governance") ||
    (profile.primary_domain === "Security" && job.domain === "Governance") ||
    (profile.primary_domain === "IT" && job.domain === "Security")
  ) {
    domainScore = 85; // Adjacent cross-domain synergy
  }

  // Seniority score (weighted 25%)
  let seniorityScore = 75;
  const exp = profile.years_experience || 0;
  if (job.seniority.includes("Junior") && exp >= 1) seniorityScore = 100;
  else if (job.seniority.includes("Mid") && exp >= 3) seniorityScore = 100;
  else if (job.seniority.includes("Senior") && exp >= 5) seniorityScore = 100;
  else if (job.seniority.includes("Lead") && exp >= 7) seniorityScore = 100;
  else if (job.seniority.includes("Director") && exp >= 8) seniorityScore = 95;
  else seniorityScore = Math.max(40, 100 - Math.abs(5 - exp) * 10);

  // Overall Weighted Score
  const overallScore = Math.round(skillsScore * 0.5 + domainScore * 0.25 + seniorityScore * 0.25);

  // Generate actionable bridge answers for missing skills
  const suggestedBridgeAnswers = missingSkills.slice(0, 3).map((gap) => {
    return {
      gap,
      talking_point: `While my core background is strongly rooted in ${profile.skills.slice(0, 2).join(" & ")}, I have actively applied the architectural principles behind ${gap} in real-world scenarios and can rapidly ramp up within the first two weeks.`,
    };
  });

  // ATS Parseability Evaluation
  let atsScore = 85;
  const atsFeedback: string[] = [];

  if (profile.resume_text && profile.resume_text.length > 200) {
    // Check for metrics/quantifiables
    const hasNumbers = /\d+%|\$\d+|\£\d+|\d+x/i.test(profile.resume_text);
    if (hasNumbers) {
      atsScore += 5;
      atsFeedback.push("Strong quantifiable impact detected (percentages, currency, or multipliers).");
    } else {
      atsScore -= 10;
      atsFeedback.push("Consider adding quantifiable metrics (e.g. 'reduced latency by 45%', 'managed £2M budget').");
    }

    // Check for strong action verbs
    const actionVerbs = ["architected", "engineered", "orchestrated", "audited", "automated", "led", "secured", "designed"];
    const foundVerbs = actionVerbs.filter((v) => resumeTextLower.includes(v));
    if (foundVerbs.length >= 3) {
      atsScore += 5;
      atsFeedback.push(`Contains high-impact technical action verbs: ${foundVerbs.slice(0, 3).join(", ")}.`);
    } else {
      atsFeedback.push("Include more high-signal action verbs like 'Architected', 'Secured', 'Audited', 'Automated'.");
    }
  } else {
    atsScore = 70;
    atsFeedback.push("Paste your full resume text in the Profile tab to unlock deep ATS keyword scanning.");
  }

  return {
    overall_score: Math.min(100, overallScore),
    skills_score: skillsScore,
    seniority_score: seniorityScore,
    domain_score: domainScore,
    matching_skills: matchingSkills,
    missing_skills: missingSkills,
    matching_certs: matchingCerts,
    missing_certs: missingCerts,
    suggested_bridge_answers: suggestedBridgeAnswers,
    ats_parseability_score: Math.min(100, Math.max(40, atsScore)),
    ats_feedback: atsFeedback,
  };
}
