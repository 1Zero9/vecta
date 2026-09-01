import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, gdprConsent, aiActConsent, analyticsConsent } = body;

    const log = await prisma.consentLog.create({
      data: {
        userId: userId || null,
        gdprConsent: gdprConsent ?? true,
        aiActConsent: aiActConsent ?? true,
        analyticsConsent: analyticsConsent ?? false,
      },
    });

    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.warn("Consent log fallback:", error);
    return NextResponse.json({ success: true, offline: true });
  }
}
