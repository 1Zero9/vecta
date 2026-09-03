import { env } from "cloudflare:workers";
import { loadSavedItemsWithDatabase, saveSavedItemsWithDatabase, type D1SavedItemsDatabase } from "./d1SavedItemsStore";
import type { SavedItemsSnapshot } from "./savedItems";

export async function loadAuthenticatedSavedItems(userId: string): Promise<SavedItemsSnapshot | null> {
  return loadSavedItemsWithDatabase(env.DB as unknown as D1SavedItemsDatabase, userId);
}

export async function saveAuthenticatedSavedItems(userId: string, snapshot: SavedItemsSnapshot): Promise<void> {
  await saveSavedItemsWithDatabase(env.DB as unknown as D1SavedItemsDatabase, userId, snapshot);
}
