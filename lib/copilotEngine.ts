import { CandidateProfile, Job, StarQuestionPack } from "./types";

export function generateTailoredCoverLetter(profile: CandidateProfile, job: Job): string {
  const matchingKeySkills = job.req_skills.slice(0, 3).join(", ");
  const standardsText = job.governance_standards && job.governance_standards.length > 0 
    ? `ensuring rigorous compliance with standards like ${job.governance_standards.slice(0, 2).join(" and ")}`
    : "driving robust technical excellence and system reliability";

  return `Dear Hiring Team at ${job.company_name},

I am writing to express my strong enthusiasm for the ${job.title} position (${job.domain} & ${job.subdomain}). Having followed ${job.company_name}'s recent work in ${job.summary.slice(0, 80)}..., I am eager to bring my background in ${profile.skills.slice(0, 3).join(", ")} to your high-performing team.

Throughout my ${profile.years_experience || 5}+ years of experience as a ${profile.current_title || "Technology Professional"}, I have specialized in architecting scalable, secure systems and ${standardsText}. Specifically, my hands-on background with ${matchingKeySkills} directly mirrors the core responsibilities outlined for this role.

Key accomplishments directly relevant to ${job.company_name}:
• Successfully delivered enterprise-grade ${job.domain} initiatives, accelerating time-to-production while upholding strict reliability and security benchmarks.
• Championed best practices in ${job.req_skills[0] || "core architecture"} and collaborative problem solving across cross-functional engineering and governance stakeholders.
• Maintained an uncompromising commitment to ${job.governance_standards?.[0] || "compliance, zero-trust security, and operational resilience"}.

I am particularly excited about ${job.company_name}'s mission and would welcome the opportunity to discuss how my expertise can accelerate your technical milestones. Thank you for your time and consideration.

Sincerely,
${profile.full_name || "Applicant"}
${profile.current_title || "Senior Specialist"} | ${profile.primary_domain} Vector`;
}

export function generateTailoredResumeBullets(profile: CandidateProfile, job: Job): string[] {
  const topSkill = job.req_skills[0] || "Core Infrastructure";
  const secondSkill = job.req_skills[1] || "Automated Pipelines";
  const thirdSkill = job.req_skills[2] || "Governance Controls";

  return [
    `Architected and optimized mission-critical ${job.domain} workflows utilizing ${topSkill} and ${secondSkill}, reducing incident resolution times by 38% and enhancing throughput.`,
    `Engineered automated evaluation and validation pipelines incorporating ${thirdSkill}, ensuring full audit readiness and 99.95% system uptime across multi-cloud environments.`,
    `Collaborated with leadership and compliance teams to enforce ${job.governance_standards?.[0] || "security best practices"}, delivering scalable architectures on time and under budget.`,
    `Mentored a cross-functional engineering squad on ${topSkill} design patterns, increasing delivery velocity by 25% across high-concurrency production deployments.`
  ];
}

export function generateStarQuestionPack(job: Job): StarQuestionPack[] {
  if (job.domain === "AI") {
    return [
      {
        question: "Describe a scenario where a production generative model or agentic pipeline began producing hallucinations or latency spikes. How did you diagnose and resolve it?",
        category: "Incident / Crisis",
        situation: "During a high-concurrency product rollout, the model serving layer experienced unexpected latency degradation (P99 increased from 90ms to 480ms) along with semantic drift in response quality.",
        task: "Identify root cause immediately, stabilize the real-time inference latency under 100ms, and implement guardrails against hallucinated entity extraction.",
        action: "Leveraged distributed tracing (OpenTelemetry) and vLLM profiling to identify GPU memory fragmentation and cache thrashing. Deployed speculative decoding, quantized weights (FP8), and integrated a semantic cache with vector similarity checks.",
        result: "Restored P99 latency to 75ms (84% improvement) and eliminated hallucination breaches across 2.5M daily inferences.",
        pro_tip: "Highlight your quantitative performance benchmarks and specific memory management strategies."
      },
      {
        question: "How do you architect an autonomous multi-agent reasoning loop while maintaining deterministic safety and cost controls?",
        category: "Technical / Domain",
        situation: "The organization required an autonomous agent system capable of executing multi-step data transformations without human intervention.",
        task: "Design an agentic state machine with built-in validation gates, token budget ceilings, and rollback capabilities.",
        action: "Implemented a state graph using LangGraph with supervisor verification nodes. Enforced strict schema outputs using Pydantic and established circuit breakers for token consumption.",
        result: "Reduced failed autonomous executions by 92% and cut API token costs by 40% through intelligent prompt caching.",
        pro_tip: "Emphasize guardrails, state persistence, and observability."
      }
    ];
  } else if (job.domain === "Security") {
    return [
      {
        question: "Tell me about a high-severity cloud security breach or zero-day vulnerability you had to contain under severe time pressure.",
        category: "Incident / Crisis",
        situation: "Cloud security posture monitoring flagged unauthorized IAM privilege escalation and unusual outbound egress traffic from an active Kubernetes worker node.",
        task: "Isolate the compromised node within 5 minutes, determine the initial access vector, and prevent lateral movement across the enterprise VPC.",
        action: "Triggered automated eBPF containment scripts to sever network sockets while capturing memory forensics. Traced the entry vector to an unpatched third-party dependency in a public container image, and patched the CI/CD pipeline with Semgrep and Snyk rules.",
        result: "Contained the incident with zero customer data exfiltration and implemented continuous automated runtime gating.",
        pro_tip: "Structure your response with clear triage timelines and long-term preventative fixes."
      },
      {
        question: "How do you enforce DevSecOps guardrails without alienating software engineering teams?",
        category: "Leadership / Governance",
        situation: "Developers were bypassing manual security reviews to meet tight sprint deadlines, introducing critical vulnerabilities into staging.",
        task: "Shift security left by embedding non-blocking, automated PR feedback directly into developer pull requests.",
        action: "Created standardized GitHub Actions security templates with automated auto-fix suggestions for common OWASP issues and held monthly developer security champions workshops.",
        result: "Decreased critical vulnerabilities reaching QA by 74% and increased developer satisfaction scores by 35%.",
        pro_tip: "Showcase empathy for engineering velocity and automation over manual friction."
      }
    ];
  } else if (job.domain === "Governance") {
    return [
      {
        question: "Describe how you led an organization through a complex regulatory audit (e.g. EU AI Act, ISO 42001, NIS2, or SOC 2) with competing deadlines.",
        category: "Leadership / Governance",
        situation: "An enterprise product launch was at risk due to newly introduced EU AI Act transparency requirements and pending ISO 42001 certification requirements.",
        task: "Design the risk assessment charter, coordinate cross-functional evidence collection, and achieve full audit sign-off without delaying the commercial launch.",
        action: "Built a centralized risk register mapping technical controls to ISO 42001 and EU AI Act requirements. Collaborated with AI engineering leads to automate model card documentation and bias testing.",
        result: "Passed the audit with zero critical non-conformities and delivered the compliance certification 2 weeks ahead of schedule.",
        pro_tip: "Emphasize your ability to translate complex regulatory legalese into actionable engineering tasks."
      },
      {
        question: "How do you handle executive pushback when a risk assessment reveals high compliance exposure on a revenue-generating project?",
        category: "Problem Solving",
        situation: "Executive stakeholders wanted to bypass a mandatory third-party AI vendor risk review to close a major quarterly deal.",
        task: "Communicate the legal, operational, and reputational risks clearly while offering a compliant mitigation pathway.",
        action: "Presented a quantitative risk impact matrix to the C-suite illustrating potential regulatory fines and data leak liabilities, while architecting a dual-phase rollout with contractual risk guarantees.",
        result: "Secured unanimous board approval for the safer rollout plan, preserving company compliance and successfully onboarding the client.",
        pro_tip: "Focus on business partnership rather than being an obstacle."
      }
    ];
  } else {
    // IT Infrastructure & Cloud
    return [
      {
        question: "Walk me through an incident where a core cloud service suffered a multi-region outage and how you orchestrated recovery.",
        category: "Incident / Crisis",
        situation: "A major cloud provider DNS and IAM outage impacted primary database replication across the European region.",
        task: "Execute failover to secondary region, preserve data integrity (RPO < 1 min), and communicate status to senior stakeholders.",
        action: "Activated automated Terraform disaster recovery scripts, switched global CDN routing, and validated database transaction logs before rerouting user traffic.",
        result: "Restored full service in 4 minutes with zero lost transactions, beating the RTO target by 80%.",
        pro_tip: "Emphasize automation, runbook drills, and calm communication."
      },
      {
        question: "How do you approach modernizing legacy enterprise IT systems while maintaining 99.99% availability?",
        category: "Technical / Domain",
        situation: "The company operated on fragmented on-premise Active Directory and legacy networking hardware that struggled with hybrid workforce demands.",
        task: "Migrate 2,500 users to Microsoft Entra ID and Zero Trust cloud identity with zero business interruption.",
        action: "Devised a phased migration ring strategy with automated PowerShell synchronization, conditional access policies, and self-service passwordless onboarding.",
        result: "Completed migration 1 month ahead of schedule with a 65% reduction in IT helpdesk identity tickets.",
        pro_tip: "Discuss change management, phased rollouts, and user impact mitigation."
      }
    ];
  }
}
