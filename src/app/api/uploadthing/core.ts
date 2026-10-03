import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getSessionFromRequest } from "@/lib/session";

const f = createUploadthing();

export const ourFileRouter = {
  // อัปโหลดสลิปโอนเงิน (ต้องล็อกอิน, รับไฟล์ภาพสูงสุด 4MB)
  slipUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await getSessionFromRequest(req);
      if (!session) throw new UploadThingError("กรุณาเข้าสู่ระบบก่อนอัปโหลด");
      return { userId: session.uid };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Slip uploaded by", metadata.userId, file.url);
      return { url: file.url };
    }),

  // อัปโหลด QR Code สำหรับรับเงิน (เฉพาะแอดมิน, รับไฟล์ภาพสูงสุด 4MB)
  qrUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await getSessionFromRequest(req);
      if (!session) throw new UploadThingError("กรุณาเข้าสู่ระบบก่อนอัปโหลด");
      if (session.role !== "ADMIN") throw new UploadThingError("เฉพาะแอดมินเท่านั้นที่อัปโหลด QR Code ได้");
      return { userId: session.uid };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("QR uploaded by", metadata.userId, file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
