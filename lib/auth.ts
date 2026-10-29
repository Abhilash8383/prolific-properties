import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";
import { ObjectId } from "mongodb";
import { cache } from "react";
import { collection } from "./db";

export const SESSION_COOKIE = "pp_session";
const MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");
  return new TextEncoder().encode(s);
}

export type Session = { adminId: string; email: string; version: number };

export async function createSession(session: Session) {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function verifyToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.adminId !== "string" || typeof payload.email !== "string") return null;
    return { adminId: payload.adminId, email: payload.email, version: Number(payload.version ?? 0) };
  } catch {
    return null;
  }
}

export async function getSession() {
  return verifyToken((await cookies()).get(SESSION_COOKIE)?.value);
}

// Every admin page and server action must call this; the proxy check alone is not enough.
export const requireAdmin = cache(async () => {
  const session = await getSession();
  if (!session || !ObjectId.isValid(session.adminId)) redirect("/admin/login");
  const admin = await (await collection("admins")).findOne(
    { _id: new ObjectId(session.adminId) },
    { projection: { sessionVersion: 1 } },
  );
  if (!admin || Number(admin.sessionVersion ?? 0) !== session.version) redirect("/admin/login");
  return session;
});
