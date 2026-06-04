import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "familiekompas_admin";
const ADMIN_COOKIE_PAYLOAD = "familiekompas-admin-v1";

function getAdminSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET ontbreekt.");
  }
  return secret;
}

export function signAdminCookie() {
  const signature = createHmac("sha256", getAdminSessionSecret()).update(ADMIN_COOKIE_PAYLOAD).digest("hex");
  return `${ADMIN_COOKIE_PAYLOAD}.${signature}`;
}

export function verifyAdminCookie(value: string | undefined) {
  if (!value) return false;

  const [payload, signature] = value.split(".");
  if (payload !== ADMIN_COOKIE_PAYLOAD || !signature) return false;

  const expected = createHmac("sha256", getAdminSessionSecret()).update(payload).digest("hex");
  if (signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function setAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, signAdminCookie(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/beheer",
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/beheer",
    maxAge: 0
  });
}
