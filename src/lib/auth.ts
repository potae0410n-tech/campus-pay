import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
  type SessionRole,
} from "@/lib/session";

export interface AuthUser {
  id: string;
  role: SessionRole;
  studentId: string;
}

export async function setSessionCookie(uid: string, role: SessionRole) {
  const token = await signSession({ uid, role });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession() {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
}

// ต้องล็อกอิน — ตรวจซ้ำกับฐานข้อมูล (กันกรณี user ถูกลบ/เปลี่ยน role)
export async function requireUser(): Promise<AuthUser> {
  const session = await getSession();
  if (!session) throw new Error("กรุณาเข้าสู่ระบบก่อนใช้งาน");

  const user = await prisma.user.findUnique({
    where: { id: session.uid },
    select: { id: true, role: true, studentId: true },
  });
  if (!user) throw new Error("ไม่พบบัญชีผู้ใช้ กรุณาเข้าสู่ระบบใหม่");

  return { id: user.id, role: user.role as SessionRole, studentId: user.studentId };
}

// ต้องเป็นแอดมินเท่านั้น
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("เฉพาะแอดมิน/เหรัญญิกเท่านั้นที่ทำรายการนี้ได้");
  return user;
}
