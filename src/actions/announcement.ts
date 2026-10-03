"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireUser } from "@/lib/auth";

// อนุญาตเฉพาะ URL ที่มาจาก Uploadthing เท่านั้น (กันการแอบใส่ลิงก์ภายนอก)
function isTrustedUploadUrl(url: string) {
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      (u.hostname === "utfs.io" || u.hostname === "ufs.sh" || u.hostname.endsWith(".ufs.sh"))
    );
  } catch {
    return false;
  }
}

// ---- ADMIN: สร้างประกาศ ----
export async function createAnnouncement(data: {
  title: string;
  description?: string;
  amount: number;
  bankAccount: string;
  bankName: string;
  startDate: string;
  dueDate: string;
  qrCodeUrl?: string;
}) {
  try {
    await requireAdmin();

    if (data.qrCodeUrl && !isTrustedUploadUrl(data.qrCodeUrl)) {
      return { success: false, error: "ลิงก์รูป QR Code ไม่ถูกต้อง" };
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        amount: data.amount,
        bankAccount: data.bankAccount,
        bankName: data.bankName,
        qrCodeUrl: data.qrCodeUrl || null,
        startDate: new Date(data.startDate),
        dueDate: new Date(data.dueDate),
      },
    });

    // สร้าง Payment record ให้นักศึกษาทุกคนอัตโนมัติ
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
    });

    if (students.length > 0) {
      await prisma.payment.createMany({
        data: students.map((s) => ({
          userId: s.id,
          announcementId: announcement.id,
          status: "UNPAID",
        })),
      });
    }

    revalidatePath("/admin/announcements");
    revalidatePath("/student/dashboard");

    return { success: true, announcement };
  } catch (error: any) {
    console.error("Error creating announcement:", error);
    return { success: false, error: error.message };
  }
}

// ---- ADMIN: ดูประกาศทั้งหมด ----
export async function getAnnouncements() {
  try {
    await requireAdmin();

    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { payments: true } },
        payments: {
          select: { status: true },
        },
      },
    });
    return { success: true, announcements };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---- ดูรายละเอียดประกาศ + รายชื่อนักศึกษา ----
// แอดมิน: เห็นครบ | นักศึกษา: เห็นชื่อ+สถานะของเพื่อน แต่ไม่เห็นรหัสนักศึกษา/สลิปของคนอื่น
export async function getAnnouncementById(id: string) {
  try {
    const me = await requireUser();

    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        payments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentId: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!announcement) return { success: false, error: "Not found" };

    const payments = announcement.payments.map((p) => {
      const isMe = p.userId === me.id;
      if (me.role === "ADMIN") return { ...p, isMe };
      return {
        ...p,
        isMe,
        slipUrl: isMe ? p.slipUrl : null,
        user: {
          ...p.user,
          id: isMe ? p.user.id : "",
          studentId: isMe ? p.user.studentId : "",
        },
      };
    });

    return { success: true, announcement: { ...announcement, payments } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---- STUDENT: ดูประกาศที่ต้องชำระ (ใช้ตัวตนจาก session เสมอ — พารามิเตอร์ถูกละเว้น) ----
export async function getMyAnnouncements(_studentId?: string) {
  try {
    const me = await requireUser();

    const user = await prisma.user.findUnique({
      where: { id: me.id },
      select: { id: true, firstName: true, lastName: true, studentId: true, username: true, role: true },
    });

    const payments = await prisma.payment.findMany({
      where: { userId: me.id },
      include: {
        announcement: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, payments, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---- STUDENT: อัปโหลด/แก้ไขสลิป ----
export async function uploadSlip(paymentId: string, slipUrl: string) {
  try {
    const me = await requireUser();

    if (!isTrustedUploadUrl(slipUrl)) {
      return { success: false, error: "ลิงก์สลิปไม่ถูกต้อง" };
    }

    const existing = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!existing || existing.userId !== me.id) {
      return { success: false, error: "ไม่พบรายการชำระเงินของคุณ" };
    }
    if (existing.status === "APPROVED") {
      return { success: false, error: "รายการนี้ได้รับการอนุมัติแล้ว ไม่สามารถแก้ไขสลิปได้" };
    }

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        slipUrl,
        status: "PENDING",
      },
    });

    revalidatePath("/student/dashboard");
    revalidatePath("/student/announcements");
    revalidatePath("/admin/announcements");

    return { success: true, payment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---- ADMIN: อนุมัติ/ปฏิเสธ สลิป ----
export async function reviewPayment(paymentId: string, action: "APPROVED" | "REJECTED") {
  try {
    await requireAdmin();

    if (action !== "APPROVED" && action !== "REJECTED") {
      return { success: false, error: "การดำเนินการไม่ถูกต้อง" };
    }

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: action },
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/student/dashboard");
    return { success: true, payment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---- ADMIN: ดึงข้อมูล Dashboard ----
export async function getAdminDashboardStats() {
  try {
    await requireAdmin();

    const [studentCount, announcementCount, students, payments] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.announcement.count(),
      prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { studentId: "asc" },
        select: { id: true, firstName: true, lastName: true, studentId: true, createdAt: true },
      }),
      prisma.payment.findMany({
        where: { status: "APPROVED" },
        include: { announcement: { select: { amount: true } } },
      }),
    ]);

    const totalCollected = payments.reduce((sum, p) => sum + p.announcement.amount, 0);

    // ดึงหรือสร้าง GeneralFund record
    let fund = await prisma.generalFund.findFirst();
    if (!fund) {
      fund = await prisma.generalFund.create({
        data: { generalBalance: 0, classFund: 0 },
      });
    }

    return {
      success: true,
      studentCount,
      announcementCount,
      totalCollected,
      students,
      fund,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---- STUDENT: ดึงประวัติการชำระเงินทั้งหมด (ใช้ตัวตนจาก session เสมอ) ----
export async function getMyPaymentHistory(_studentId?: string) {
  try {
    const me = await requireUser();

    const user = await prisma.user.findUnique({
      where: { id: me.id },
      select: { id: true, firstName: true, lastName: true, studentId: true, username: true, role: true },
    });
    if (!user) return { success: false, error: "ไม่พบนักศึกษา" };

    const payments = await prisma.payment.findMany({
      where: { userId: me.id },
      include: {
        announcement: {
          select: {
            id: true,
            title: true,
            description: true,
            amount: true,
            bankAccount: true,
            bankName: true,
            startDate: true,
            dueDate: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, payments, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---- ADMIN: อัปเดตยอดเงินกองกลาง / เงินรุ่น ----
export async function updateGeneralFund(data: { generalBalance?: number; classFund?: number }) {
  try {
    await requireAdmin();

    let fund = await prisma.generalFund.findFirst();
    if (fund) {
      fund = await prisma.generalFund.update({
        where: { id: fund.id },
        data: {
          ...(data.generalBalance !== undefined && { generalBalance: data.generalBalance }),
          ...(data.classFund !== undefined && { classFund: data.classFund }),
        },
      });
    } else {
      fund = await prisma.generalFund.create({ data });
    }
    revalidatePath("/admin/dashboard");
    return { success: true, fund };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---- ADMIN: อัปเดต QR Code ของประกาศ ----
export async function updateAnnouncementQr(announcementId: string, qrCodeUrl: string) {
  try {
    await requireAdmin();

    if (!isTrustedUploadUrl(qrCodeUrl)) {
      return { success: false, error: "ลิงก์รูป QR Code ไม่ถูกต้อง" };
    }

    const updated = await prisma.announcement.update({
      where: { id: announcementId },
      data: { qrCodeUrl },
    });
    revalidatePath("/admin/announcements");
    revalidatePath(`/admin/announcements/${announcementId}`);
    revalidatePath(`/student/announcements/${announcementId}`);
    return { success: true, announcement: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
