import { describe, expect, it } from "vitest";
import { generateStarQuestionPack, generateTailoredCoverLetter, generateTailoredResumeBullets } from "@/lib/copilotEngine";
import { makeJob, makeProfile } from "./fixtures";

describe("copilotEngine", () => {
  it("uses candidate evidence without inventing achievements or metrics", () => {
    const profile = makeProfile({
      evidence: [{
        id: "evidence-1",
        type: "Project",
        title: "Platform migration",
        description: "Migrated a service to Kubernetes and documented the rollback plan.",
        claims: ["Kubernetes"],
      }],
    });
    const job = makeJob();

    const letter = generateTailoredCoverLetter(profile, job);
    const bullets = generateTailoredResumeBullets(profile, job);
    expect(letter).toContain("Platform migration: Migrated a service to Kubernetes");
    expect(bullets[0]).toContain("Migrated a service to Kubernetes");
    expect(`${letter} ${bullets.join(" ")}`).not.toMatch(/38%|99\.95%|25%/);
  });

  it("returns explicit prompts when verified evidence is unavailable", () => {
    const job = makeJob({ domain: "Security" });
    const letter = generateTailoredCoverLetter(makeProfile({ evidence: [] }), job);
    const bullets = generateTailoredResumeBullets(makeProfile({ evidence: [] }), job);
    const starPack = generateStarQuestionPack(job);

    expect(letter).toContain("[Add a verified example");
    expect(bullets.every((bullet) => bullet.startsWith("[Add a verified example"))).toBe(true);
    expect(starPack.every((item) => item.result.includes("verified outcome"))).toBe(true);
  });
});
