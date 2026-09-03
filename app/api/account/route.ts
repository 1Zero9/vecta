import { NextResponse } from "next/server";
import { upsertAuthenticatedAccount } from "@/lib/accountStore";
import { readSitesIdentity } from "@/lib/sitesIdentity";

export async function POST(request: Request) {
  const identity = readSitesIdentity(request.headers);
  if (!identity) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const account = await upsertAuthenticatedAccount(identity);
    if (account?.status === "suspended") {
      return NextResponse.json({ authenticated: true, suspended: true }, { status: 403 });
    }
    return NextResponse.json({
      authenticated: true,
      account: account
        ? { ...account, persisted: true }
        : { ...identity, persisted: false },
    });
  } catch (error) {
    console.error("Unable to create the authenticated account record:", error);
    return NextResponse.json({ authenticated: true, persisted: false }, { status: 503 });
  }
}
