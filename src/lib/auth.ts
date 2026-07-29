import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "nusa-badminton-secret-key-2026";
const JWT_SECRET_BYTES = new TextEncoder().encode(JWT_SECRET);

function b64url(input: string) {
  return btoa(input).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function createToken(payload: Record<string, unknown>) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + 86400 * 7 };

  const data = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(body))}`;
  const key = await crypto.subtle.importKey("raw", JWT_SECRET_BYTES, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = b64url(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data)))));

  return `${data}.${sig}`;
}

async function verifyToken(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, bodyB64, sigB64] = parts;
    const key = await crypto.subtle.importKey("raw", JWT_SECRET_BYTES, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sig = Uint8Array.from(atob(sigB64.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify("HMAC", key, sig, new TextEncoder().encode(`${headerB64}.${bodyB64}`));
    if (!valid) return null;
    const body = JSON.parse(atob(bodyB64.replace(/-/g, "+").replace(/_/g, "/")));
    if (body.exp < Math.floor(Date.now() / 1000)) return null;
    return body;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password + JWT_SECRET));
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function setAuth(username: string) {
  const token = await createToken({ username });
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 86400 * 7,
  });
  return token;
}

export async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth() {
  const user = await getAuth();
  if (!user) throw new Error("Unauthorized");
  return user;
}
