export interface SitesIdentity {
  id: string;
  email: string;
  name: string | null;
}

function decodeOptionalName(headers: Headers): string | null {
  const encoded = headers.get("oai-authenticated-user-full-name");
  if (!encoded || headers.get("oai-authenticated-user-full-name-encoding") !== "percent-encoded-utf-8") {
    return null;
  }

  try {
    return decodeURIComponent(encoded).trim() || null;
  } catch {
    return null;
  }
}

export function readSitesIdentity(headers: Headers): SitesIdentity | null {
  const id = headers.get("oai-authenticated-user-id")?.trim();
  const email = headers.get("oai-authenticated-user-email")?.trim();
  if (!id || !email) return null;

  return { id, email, name: decodeOptionalName(headers) };
}
