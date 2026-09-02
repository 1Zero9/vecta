import { NextResponse } from "next/server";
import { saveSynchronizedConsent } from "@/lib/profileSync";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, gdprConsent, aiActConsent, analyticsConsent } = body;

    const log = await saveSynchronizedConsent(userId, {
      gdprConsent,
      aiActConsent,
      analyticsConsent,
    });

    return NextResponse.json(
      log ? { success: true, log } : { success: true, offline: true },
    );
  } catch (error) {
    console.warn("Consent log fallback:", error);
    return NextResponse.json({ success: true, offline: true });
  }
}
