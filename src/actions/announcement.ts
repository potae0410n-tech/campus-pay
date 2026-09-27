"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

// ---- ADMIN: ดูรายละเอียดประกาศ + รายชื่อนักศึกษา ----
export async function getAnnouncementById(id: string) {
  try {
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
    return { success: true, announcement };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---- STUDENT: ดูประกาศที่ต้องชำระ ----
export async function getMyAnnouncements(studentId: string = "650000000000") {
  try {
    // จำลอง: หา user ด้วย studentId (hardcoded สำหรับ prototype)
    let user = await prisma.user.findFirst({
      where: { studentId },
    });

    if (!user) {
      // สร้าง dummy student ถ้ายังไม่มี
      user = await prisma.user.create({
        data: {
          username: "somchai123",
          studentId: "650000000000",
          firstName: "สมชาย",
          lastName: "ใจดี",
          password: "hashedpassword",
          role: "STUDENT",
        },
      });

      // สร้าง Payment records สำหรับทุกประกาศที่มีอยู่
      const allAnnouncements = await prisma.announcement.findMany();
      if (allAnnouncements.length > 0) {
        await prisma.payment.createMany({
          data: allAnnouncements.map((a) => ({
            userId: user!.id,
            announcementId: a.id,
            status: "UNPAID",
          })),
          skipDuplicates: true,
        });
      }
    }

    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
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

// ---- STUDENT: อัปโหลดสลิป ----
export async function uploadSlip(paymentId: string, slipUrl: string) {
  try {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        slipUrl,
        status: "PENDING",
      },
    });

    revalidatePath("/student/dashboard");
    revalidatePath("/student/announcements");

    return { success: true, payment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---- ADMIN: อนุมัติ/ปฏิเสธ สลิป ----
export async function reviewPayment(paymentId: string, action: "APPROVED" | "REJECTED") {
  try {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: action },
    });

    revalidatePath("/admin/announcements");
    return { success: true, payment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---- ADMIN: ดึงข้อมูล Dashboard ----
export async function getAdminDashboardStats() {
  try {
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

// ---- STUDENT: ดึงประวัติการชำระเงินทั้งหมด ----
export async function getMyPaymentHistory(studentId: string = "650000000000") {
  try {
    const user = await prisma.user.findFirst({
      where: { studentId },
    });

    if (!user) return { success: false, error: "ไม่พบนักศึกษา" };

    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
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
