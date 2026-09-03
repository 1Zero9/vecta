import type { SavedItemsSnapshot } from "./savedItems";

export async function loadAuthenticatedSavedItems(_userId: string): Promise<SavedItemsSnapshot | null> {
  return null;
}

export async function saveAuthenticatedSavedItems(_userId: string, _snapshot: SavedItemsSnapshot): Promise<void> {
  throw new Error("Protected saved items are unavailable in this runtime.");
}
