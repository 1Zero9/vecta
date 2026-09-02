import { NextResponse } from "next/server";
import { loadSynchronizedProfile, saveSynchronizedProfile } from "@/lib/profileSync";
import { DEFAULT_USER, DEMO_PERSONAS } from "@/lib/storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || DEFAULT_USER.email;

    const synchronized = await loadSynchronizedProfile(email);
    return NextResponse.json(
      synchronized
        ? {
            user: synchronized.user,
            profile: synchronized.profile ?? DEMO_PERSONAS["alex-ai-sec"].profile,
          }
        : { user: DEFAULT_USER, profile: DEMO_PERSONAS["alex-ai-sec"].profile },
    );
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

    const upserted = await saveSynchronizedProfile(user, profile);

    return NextResponse.json(
      upserted ? { success: true, user: upserted } : { success: true, offline: true },
    );
  } catch (error) {
    console.warn("Prisma user save fallback:", error);
    return NextResponse.json({ success: true, offline: true });
  }
}
