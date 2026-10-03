"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth";

const ADMIN_SECRET_CODE = "iloveIT2568"; // รหัสลับสำหรับสมัครแอดมิน

// ---- ล็อกอิน ----
export async function loginUser(identifier: string, password: string) {
  try {
    // หา user จาก studentId หรือ username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { studentId: identifier },
          { username: identifier },
        ],
      },
    });

    if (!user) {
      return { success: false, error: "ไม่พบบัญชีผู้ใช้นี้" };
    }

    // เปรียบเทียบรหัสผ่านด้วย bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, error: "รหัสผ่านไม่ถูกต้อง" };
    }

    // ออก session cookie (httpOnly) — server จะใช้ตัวนี้ยืนยันตัวตนทุก action
    await setSessionCookie(user.id, user.role === "ADMIN" ? "ADMIN" : "STUDENT");

    return {
      success: true,
      role: user.role, // "STUDENT" or "ADMIN"
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        studentId: user.studentId,
        username: user.username,
        role: user.role,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---- ออกจากระบบ ----
export async function logoutUser() {
  await clearSessionCookie();
  return { success: true };
}

// ---- สมัครสมาชิก ----
export async function registerUser(data: {
  username: string;
  firstName: string;
  lastName: string;
  studentId: string;
  password: string;
  role: "STUDENT" | "ADMIN";
  adminCode?: string;
}) {
  try {
    // ตรวจสอบรหัสแอดมิน
    if (data.role === "ADMIN") {
      if (!data.adminCode || data.adminCode !== ADMIN_SECRET_CODE) {
        return { success: false, error: "รหัสยืนยันแอดมินไม่ถูกต้อง" };
      }
    }

    // ตรวจสอบรหัสนักศึกษา 12 หลัก
    if (data.studentId.length !== 12) {
      return { success: false, error: "รหัสนักศึกษาต้องมี 12 หลัก" };
    }

    // ตรวจสอบว่ามีอยู่แล้วหรือไม่
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          { studentId: data.studentId },
        ],
      },
    });

    if (existing) {
      if (existing.username === data.username) {
        return { success: false, error: "ชื่อผู้ใช้นี้มีคนใช้แล้ว" };
      }
      return { success: false, error: "รหัสนักศึกษานี้ถูกลงทะเบียนแล้ว" };
    }

    // Hash รหัสผ่าน
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        studentId: data.studentId,
        password: hashedPassword,
        role: data.role,
      },
    });

    // ถ้าเป็นนักศึกษา → สร้าง Payment records สำหรับประกาศที่มีอยู่
    if (data.role === "STUDENT") {
      const allAnnouncements = await prisma.announcement.findMany();
      if (allAnnouncements.length > 0) {
        await prisma.payment.createMany({
          data: allAnnouncements.map((a) => ({
            userId: user.id,
            announcementId: a.id,
            status: "UNPAID",
          })),
          skipDuplicates: true,
        });
      }
    }

    revalidatePath("/admin/dashboard");
    return { success: true, role: user.role };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
