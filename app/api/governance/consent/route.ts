import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, gdprConsent, aiActConsent, analyticsConsent } = body;

    let validUserId: string | null = null;
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (userExists) {
        validUserId = userId;
      }
    }

    const log = await prisma.consentLog.create({
      data: {
        userId: validUserId,
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
