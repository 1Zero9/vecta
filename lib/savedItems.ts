import { z } from "zod";
import type { ProfileProtectionState } from "./profileProtection";

export interface SavedItemsSnapshot {
  savedJobIds: string[];
  favouriteCompanyIds: string[];
}

export type SavedItemsProtectionState = ProfileProtectionState;

const identifierList = z.array(z.string().trim().min(1).max(150)).max(2000)
  .transform((items) => [...new Set(items)].sort());

export const savedItemsSnapshotSchema = z.object({
  savedJobIds: identifierList,
  favouriteCompanyIds: identifierList,
}).strict();

export function parseSavedItemsSnapshot(value: unknown) {
  return savedItemsSnapshotSchema.safeParse(value);
}

export function savedItemsAreEquivalent(left: SavedItemsSnapshot, right: SavedItemsSnapshot): boolean {
  const canonical = (snapshot: SavedItemsSnapshot) => ({
    savedJobIds: [...new Set(snapshot.savedJobIds)].sort(),
    favouriteCompanyIds: [...new Set(snapshot.favouriteCompanyIds)].sort(),
  });
  return JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));
}
