import { NextResponse } from "next/server";
import { upsertAuthenticatedAccount } from "@/lib/accountStore";
import { loadAuthenticatedProfile, saveAuthenticatedProfile } from "@/lib/profileStore";
import { parseCandidateProfile } from "@/lib/profileValidation";
import { readSitesIdentity } from "@/lib/sitesIdentity";

async function requireActiveAccount(request: Request) {
  const identity = readSitesIdentity(request.headers);
  if (!identity) return { error: NextResponse.json({ authenticated: false }, { status: 401 }) };

  const account = await upsertAuthenticatedAccount(identity);
  if (!account) return { error: NextResponse.json({ authenticated: true, available: false }, { status: 503 }) };
  if (account.status === "suspended") {
    return { error: NextResponse.json({ authenticated: true, suspended: true }, { status: 403 }) };
  }

  return { identity };
}

export async function GET(request: Request) {
  try {
    const access = await requireActiveAccount(request);
    if ("error" in access) return access.error;
    const profile = await loadAuthenticatedProfile(access.identity.id);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Unable to load the protected profile:", error);
    return NextResponse.json({ error: "Protected profile unavailable." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  try {
    const access = await requireActiveAccount(request);
    if ("error" in access) return access.error;

    const body = await request.json();
    const result = parseCandidateProfile(body?.profile);
    if (!result.success) {
      return NextResponse.json({ error: "The profile contains invalid or unsupported fields." }, { status: 400 });
    }

    await saveAuthenticatedProfile(access.identity.id, result.data);
    return NextResponse.json({ success: true, profile: result.data });
  } catch (error) {
    console.error("Unable to save the protected profile:", error);
    return NextResponse.json({ error: "Protected profile could not be saved." }, { status: 503 });
  }
}
