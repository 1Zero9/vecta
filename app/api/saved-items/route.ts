import { NextResponse } from "next/server";
import { upsertAuthenticatedAccount } from "@/lib/accountStore";
import { parseSavedItemsSnapshot } from "@/lib/savedItems";
import { loadAuthenticatedSavedItems, saveAuthenticatedSavedItems } from "@/lib/savedItemsStore";
import { readSitesIdentity } from "@/lib/sitesIdentity";
import type { SitesIdentity } from "@/lib/sitesIdentity";

async function requireActiveAccount(request: Request): Promise<{ identity: SitesIdentity } | { error: NextResponse }> {
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
    return NextResponse.json({ snapshot: await loadAuthenticatedSavedItems(access.identity.id) });
  } catch (error) {
    console.error("Unable to load protected saved items:", error);
    return NextResponse.json({ error: "Protected saved items unavailable." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  try {
    const access = await requireActiveAccount(request);
    if ("error" in access) return access.error;

    const body = await request.json();
    const result = parseSavedItemsSnapshot(body?.snapshot);
    if (!result.success) {
      return NextResponse.json({ error: "The saved-item list contains invalid or unsupported fields." }, { status: 400 });
    }

    await saveAuthenticatedSavedItems(access.identity.id, result.data);
    return NextResponse.json({ success: true, snapshot: result.data });
  } catch (error) {
    console.error("Unable to save protected saved items:", error);
    return NextResponse.json({ error: "Protected saved items could not be saved." }, { status: 503 });
  }
}
