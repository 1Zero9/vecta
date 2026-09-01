import { CandidateProfile, Job, VectorMatchResult } from "./types";

function claimsOverlap(first: string, second: string): boolean {
  const normalizedFirst = first.toLowerCase().trim();
  const normalizedSecond = second.toLowerCase().trim();
  return normalizedFirst.includes(normalizedSecond) || normalizedSecond.includes(normalizedFirst);
}

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
    const isDirectMatch = profileSkillsLower.some((profileSkill) => claimsOverlap(profileSkill, sLower));
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
    const isDirectMatch = profileCertsLower.some((profileCert) => claimsOverlap(profileCert, cLower));
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

  const matchedClaims = Array.from(new Set([...matchingSkills, ...matchingCerts]));
  const evidenceMatches = matchedClaims.flatMap((claim) => {
    const linkedEvidence = (profile.evidence ?? []).filter((evidence) =>
      evidence.claims.some((evidenceClaim) => claimsOverlap(evidenceClaim, claim)),
    );
    return linkedEvidence.length > 0 ? [{ claim, evidence: linkedEvidence }] : [];
  });
  const evidencedClaimKeys = new Set(evidenceMatches.map((match) => match.claim.toLowerCase()));
  const unsupportedMatches = matchedClaims.filter((claim) => !evidencedClaimKeys.has(claim.toLowerCase()));
  const evidenceCoverageScore = matchedClaims.length > 0
    ? Math.round((evidenceMatches.length / matchedClaims.length) * 100)
    : 0;

  let confidenceScore = 0;
  const confidenceReasons: string[] = [];
  const confidenceLimitations: string[] = [];

  if (profile.skills.length >= 5) {
    confidenceScore += 25;
    confidenceReasons.push(`${profile.skills.length} structured profile skills are available.`);
  } else if (profile.skills.length >= 3) {
    confidenceScore += 18;
    confidenceReasons.push(`${profile.skills.length} structured profile skills are available.`);
  } else {
    confidenceScore += profile.skills.length * 4;
    confidenceLimitations.push("Add at least three specific skills to make role comparisons meaningful.");
  }

  if (profile.resume_text.trim().length >= 300) {
    confidenceScore += 25;
    confidenceReasons.push("The résumé contains enough career detail for contextual matching.");
  } else if (profile.resume_text.trim().length >= 150) {
    confidenceScore += 18;
    confidenceReasons.push("The résumé provides useful supporting context.");
  } else if (profile.resume_text.trim().length > 0) {
    confidenceScore += 8;
    confidenceLimitations.push("The résumé evidence is too brief for a strong contextual assessment.");
  } else {
    confidenceLimitations.push("No résumé or career-history text is available.");
  }

  if (allJobSkills.length >= 5) {
    confidenceScore += 25;
    confidenceReasons.push(`The role provides ${allJobSkills.length} scorable skill requirements.`);
  } else if (allJobSkills.length >= 3) {
    confidenceScore += 18;
    confidenceReasons.push(`The role provides ${allJobSkills.length} scorable skill requirements.`);
  } else {
    confidenceScore += allJobSkills.length * 4;
    confidenceLimitations.push("The job description contains too few structured requirements for a precise comparison.");
  }

  if (evidenceCoverageScore >= 60) {
    confidenceScore += 25;
    confidenceReasons.push(`${evidenceCoverageScore}% of matched claims have linked evidence.`);
  } else if (evidenceCoverageScore >= 30) {
    confidenceScore += 15;
    confidenceReasons.push(`${evidenceCoverageScore}% of matched claims have linked evidence.`);
  } else if (evidenceCoverageScore > 0) {
    confidenceScore += 8;
    confidenceLimitations.push("Most matching claims are not yet linked to evidence.");
  } else if (matchedClaims.length > 0) {
    confidenceLimitations.push("No matching claims are linked to evidence yet.");
  }

  if ((profile.years_experience ?? 0) <= 0) {
    confidenceLimitations.push("Years of experience are missing, so seniority alignment is uncertain.");
  }

  const confidenceLevel: VectorMatchResult["confidence_level"] = confidenceScore >= 75
    ? "High"
    : confidenceScore >= 45
      ? "Moderate"
      : "Low";

  // Generate actionable bridge answers for missing skills
  const suggestedBridgeAnswers = missingSkills.slice(0, 3).map((gap) => {
    return {
      gap,
      talking_point: `My strongest adjacent experience is in ${profile.skills.slice(0, 2).join(" and ") || "related work"}. I would describe the transferable principles honestly, clarify that ${gap} is a development area, and explain how I would close the gap.`,
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
    evidence_matches: evidenceMatches,
    unsupported_matches: unsupportedMatches,
    evidence_coverage_score: evidenceCoverageScore,
    confidence_level: confidenceLevel,
    confidence_score: Math.min(100, confidenceScore),
    confidence_reasons: confidenceReasons,
    confidence_limitations: confidenceLimitations,
    suggested_bridge_answers: suggestedBridgeAnswers,
    ats_parseability_score: Math.min(100, Math.max(40, atsScore)),
    ats_feedback: atsFeedback,
  };
}
