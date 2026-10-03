// Session แบบ signed cookie (HMAC-SHA256) — ใช้ Web Crypto จึงรันได้ทั้งใน proxy / server action / route handler
export const SESSION_COOKIE = "campuspay_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 วัน

export type SessionRole = "STUDENT" | "ADMIN";

export interface SessionPayload {
  uid: string;
  role: SessionRole;
  exp: number; // unix seconds
}

const encoder = new TextEncoder();

function getSecret(): string {
  // แนะนำให้ตั้ง AUTH_SECRET ใน Vercel; ถ้าไม่ตั้งจะ fallback เป็น DATABASE_URL (ซึ่งเป็นความลับอยู่แล้ว)
  const secret = process.env.AUTH_SECRET || process.env.DATABASE_URL;
  if (!secret) throw new Error("ยังไม่ได้ตั้งค่า AUTH_SECRET");
  return secret;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (str.length % 4)) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function signSession(data: { uid: string; role: SessionRole }): Promise<string> {
  const payload: SessionPayload = {
    ...data,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", await getKey(), encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(sig))}`;
}

export async function verifySession(token?: string | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await getKey(),
      fromBase64Url(sig) as BufferSource,
      encoder.encode(body)
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload;
    if (!payload.uid || (payload.role !== "STUDENT" && payload.role !== "ADMIN")) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// อ่าน session จาก Request ตรงๆ (ใช้ใน Uploadthing middleware)
export async function getSessionFromRequest(req: Request): Promise<SessionPayload | null> {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  if (!match) return null;
  return verifySession(decodeURIComponent(match.slice(SESSION_COOKIE.length + 1)));
}
