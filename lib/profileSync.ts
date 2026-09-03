import { prisma } from "@/lib/prisma";
import type { CandidateProfile, ConsentSettings, UserAccount } from "@/lib/types";
import { normalizeAccountRole } from "@/lib/accountRole";

export interface SynchronizedProfile {
  user: Omit<UserAccount, "activePersonaId">;
  profile: CandidateProfile | null;
}

export async function loadSynchronizedProfile(email: string): Promise<SynchronizedProfile | null> {
  const dbUser = await prisma.user.findUnique({
    where: { email },
    include: { profile: true, applications: true },
  });

  if (!dbUser) return null;

  return {
    user: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: normalizeAccountRole(dbUser.role),
      avatar: dbUser.avatar || "AM",
      isDemo: dbUser.isDemo,
    },
    profile: dbUser.profile
      ? {
          full_name: dbUser.name,
          current_title: dbUser.profile.currentTitle,
          primary_domain: dbUser.profile.primaryDomain as CandidateProfile["primary_domain"],
          years_experience: dbUser.profile.yearsExperience,
          skills: JSON.parse(dbUser.profile.skills || "[]"),
          certifications: JSON.parse(dbUser.profile.certifications || "[]"),
          target_salary_min: dbUser.profile.targetSalaryMin ?? undefined,
          preferred_work_mode: dbUser.profile.preferredWorkMode as CandidateProfile["preferred_work_mode"],
          resume_text: dbUser.profile.resumeText ?? "",
        }
      : null,
  };
}

export async function saveSynchronizedProfile(user: UserAccount, profile: CandidateProfile) {
  const profileData = {
    currentTitle: profile.current_title,
    primaryDomain: profile.primary_domain,
    yearsExperience: profile.years_experience,
    skills: JSON.stringify(profile.skills),
    certifications: JSON.stringify(profile.certifications),
    targetSalaryMin: profile.target_salary_min,
    preferredWorkMode: profile.preferred_work_mode,
    resumeText: profile.resume_text,
  };

  return prisma.user.upsert({
    where: { email: user.email },
    update: {
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      profile: { upsert: { create: profileData, update: profileData } },
    },
    create: {
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      isDemo: user.isDemo ?? false,
      profile: { create: profileData },
    },
  });
}

export async function saveSynchronizedConsent(
  userId: string | undefined,
  consent: Pick<ConsentSettings, "gdprConsent" | "aiActConsent" | "analyticsConsent">,
) {
  let validUserId: string | null = null;
  if (userId) {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (userExists) validUserId = userId;
  }

  return prisma.consentLog.create({
    data: {
      userId: validUserId,
      gdprConsent: consent.gdprConsent ?? true,
      aiActConsent: consent.aiActConsent ?? true,
      analyticsConsent: consent.analyticsConsent ?? false,
    },
  });
}
