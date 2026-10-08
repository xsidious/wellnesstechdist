import { cookies } from "next/headers";
import { readSession, signSession } from "@/lib/crypto";

const SESSION = "wt_session";
const PENDING = "wt_pending";

export async function setLogin(userId: string) {
  const exp = Date.now() + 1000 * 60 * 60 * 12;
  const token = signSession(`${userId}|${exp}`);
  const jar = await cookies();
  jar.set(SESSION, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  jar.delete(PENDING);
}

export async function setPending(email: string) {
  const exp = Date.now() + 1000 * 60 * 20;
  const token = signSession(`${email}|${exp}|pending`);
  const jar = await cookies();
  jar.set(PENDING, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 20 });
}

export async function readPending() {
  const token = (await cookies()).get(PENDING)?.value;
  if (!token) return null;
  const payload = readSession(token);
  if (!payload) return null;
  const [email, exp, kind] = payload.split("|");
  if (kind !== "pending" || Number(exp) < Date.now()) return null;
  return email;
}

export async function readUserId() {
  const token = (await cookies()).get(SESSION)?.value;
  if (!token) return null;
  const payload = readSession(token);
  if (!payload) return null;
  const [userId, exp] = payload.split("|");
  if (!userId || Number(exp) < Date.now()) return null;
  return userId;
}

export async function clearLogin() {
  const jar = await cookies();
  jar.delete(SESSION);
  jar.delete(PENDING);
}
