import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_USER, DEMO_PERSONAS } from "@/lib/storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || DEFAULT_USER.email;

    // Check database
    let dbUser = await prisma.user.findUnique({
      where: { email },
      include: { profile: true, applications: true },
    });

    if (!dbUser) {
      // Seed default user into Prisma
      const defaultPersona = DEMO_PERSONAS["alex-ai-sec"];
      dbUser = await prisma.user.create({
        data: {
          email: defaultPersona.user.email,
          name: defaultPersona.user.name,
          role: defaultPersona.user.role,
          avatar: defaultPersona.user.avatar,
          isDemo: true,
          profile: {
            create: {
              currentTitle: defaultPersona.profile.current_title,
              primaryDomain: defaultPersona.profile.primary_domain,
              yearsExperience: defaultPersona.profile.years_experience,
              skills: JSON.stringify(defaultPersona.profile.skills),
              certifications: JSON.stringify(defaultPersona.profile.certifications),
              targetSalaryMin: defaultPersona.profile.target_salary_min,
              preferredWorkMode: defaultPersona.profile.preferred_work_mode,
              resumeText: defaultPersona.profile.resume_text,
            },
          },
        },
        include: { profile: true, applications: true },
      });
    }

    return NextResponse.json({
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        avatar: dbUser.avatar || "AM",
        isDemo: dbUser.isDemo,
      },
      profile: dbUser.profile
        ? {
            full_name: dbUser.name,
            current_title: dbUser.profile.currentTitle,
            primary_domain: dbUser.profile.primaryDomain,
            years_experience: dbUser.profile.yearsExperience,
            skills: JSON.parse(dbUser.profile.skills || "[]"),
            certifications: JSON.parse(dbUser.profile.certifications || "[]"),
            target_salary_min: dbUser.profile.targetSalaryMin,
            preferred_work_mode: dbUser.profile.preferredWorkMode,
            resume_text: dbUser.profile.resumeText,
          }
        : DEMO_PERSONAS["alex-ai-sec"].profile,
    });
  } catch (error) {
    console.warn("Prisma query fallback to static default user:", error);
    return NextResponse.json({
      user: DEFAULT_USER,
      profile: DEMO_PERSONAS["alex-ai-sec"].profile,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user, profile } = body;

    const upserted = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        profile: {
          upsert: {
            create: {
              currentTitle: profile.current_title,
              primaryDomain: profile.primary_domain,
              yearsExperience: profile.years_experience,
              skills: JSON.stringify(profile.skills),
              certifications: JSON.stringify(profile.certifications),
              targetSalaryMin: profile.target_salary_min,
              preferredWorkMode: profile.preferred_work_mode,
              resumeText: profile.resume_text,
            },
            update: {
              currentTitle: profile.current_title,
              primaryDomain: profile.primary_domain,
              yearsExperience: profile.years_experience,
              skills: JSON.stringify(profile.skills),
              certifications: JSON.stringify(profile.certifications),
              targetSalaryMin: profile.target_salary_min,
              preferredWorkMode: profile.preferred_work_mode,
              resumeText: profile.resume_text,
            },
          },
        },
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        isDemo: user.isDemo ?? false,
        profile: {
          create: {
            currentTitle: profile.current_title,
            primaryDomain: profile.primary_domain,
            yearsExperience: profile.years_experience,
            skills: JSON.stringify(profile.skills),
            certifications: JSON.stringify(profile.certifications),
            targetSalaryMin: profile.target_salary_min,
            preferredWorkMode: profile.preferred_work_mode,
            resumeText: profile.resume_text,
          },
        },
      },
    });

    return NextResponse.json({ success: true, user: upserted });
  } catch (error) {
    console.warn("Prisma user save fallback:", error);
    return NextResponse.json({ success: true, offline: true });
  }
}
