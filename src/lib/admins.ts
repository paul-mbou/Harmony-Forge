import type { User } from "firebase/auth";

/** Keep in sync with firestore.rules, storage.rules and fgm_lyrics_app/functions/src/adminAuth.js. */
export const ADMIN_EMAILS = new Set([
  "appsindustry068@gmail.com",
  "thipavi21@gmail.com",
]);

export function isAdminUser(user: User | null): boolean {
  if (!user || user.isAnonymous || !user.emailVerified) return false;
  const viaGoogle = user.providerData.some((p) => p.providerId === "google.com");
  return viaGoogle && ADMIN_EMAILS.has((user.email || "").toLowerCase());
}
