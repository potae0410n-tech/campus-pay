"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAnnouncementById, reviewPayment, updateAnnouncementQr } from "@/actions/announcement";
import {
  ArrowLeft, Users, CreditCard, CheckCircle2, Clock, FileText,
  Loader2, Landmark, AlertCircle, CalendarDays, ExternalLink, QrCode, UploadCloud
} from "lucide-react";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";

export default function AdminAnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [ann, setAnn] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewing, setReviewing] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getAnnouncementById(id);
    if (res.success) setAnn(res.announcement);
    else { alert("ไม่พบประกาศนี้"); router.push("/admin/announcements"); }
    setIsLoading(false);
  };

  useEffect(() => { if (id) fetchData(); }, [id]);

  const handleReview = async (paymentId: string, action: "APPROVED" | "REJECTED") => {
    setReviewing(paymentId);
    await reviewPayment(paymentId, action);
    await fetchData();
    setReviewing(null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  if (!ann) return null;

  const approved = ann.payments.filter((p: any) => p.status === "APPROVED").length;
  const pending = ann.payments.filter((p: any) => p.status === "PENDING").length;
  const unpaid = ann.payments.filter((p: any) => p.status === "UNPAID").length;
  const total = ann.payments.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/announcements")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{ann.title}</h1>
          <p className="text-gray-500 mt-1 text-sm">รายละเอียดประกาศและสถานะการชำระเงินของนักศึกษา</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Info */}
        <div className="space-y-5">
          {/* Details card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4 pb-3 border-b">ข้อมูลการเรียกเก็บเงิน</h3>
            <div className="space-y-4">
              {ann.description && (
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> รายละเอียด</p>
                  <p className="text-sm font-medium text-gray-900">{ann.description}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> ยอดเงิน</p>
                <p className="text-2xl font-bold text-blue-600">฿{ann.amount.toFixed(2)}</p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><Landmark className="w-3.5 h-3.5" /> บัญชีรับโอน</p>
                <p className="text-sm font-semibold text-gray-900">{ann.bankAccount}</p>
                <p className="text-xs text-gray-500">{ann.bankName}</p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> ระยะเวลา</p>
                <p className="text-sm text-gray-900">{formatDate(ann.startDate)}</p>
                <p className="text-xs text-gray-500">ถึง</p>
                <p className="text-sm font-semibold text-red-600">{formatDate(ann.dueDate)}</p>
              </div>
            </div>
          </div>

          {/* QR Code Upload Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                <QrCode className="w-4 h-4 text-blue-600" />
                รูป QR Code รับเงิน
              </h3>
              {ann.qrCodeUrl && (
                <span className="text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold border border-green-200">
                  มีรูป QR แล้ว
                </span>
              )}
            </div>

            {ann.qrCodeUrl ? (
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col items-center">
                  <img
                    src={ann.qrCodeUrl}
                    alt="QR Code สำหรับรับเงิน"
                    className="w-48 h-48 object-contain rounded-lg border border-gray-200 bg-white"
                  />
                  <a
                    href={ann.qrCodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-2 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> ดูรูปขนาดเต็ม
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 text-center">อัปโหลดรูป QR Code ใหม่เพื่อเปลี่ยน:</p>
                  <UploadButton
                    endpoint="qrUploader"
                    onClientUploadComplete={async (res) => {
                      if (res && res[0]) {
                        await updateAnnouncementQr(ann.id, res[0].url);
                        await fetchData();
                      }
                    }}
                    onUploadError={(err: Error) => alert(`อัปโหลดไม่สำเร็จ: ${err.message}`)}
                    appearance={{
                      button: "w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 rounded-xl transition-colors border border-gray-200 shadow-xs",
                      allowedContent: "text-[10px] text-gray-400 mt-1",
                    }}
                    content={{
                      button: "🔄 เปลี่ยนรูป QR Code",
                      allowedContent: "JPG, PNG สูงสุด 4MB",
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  อัปโหลดรูป QR Code (เช่น แคปรูป QR จากแอปธนาคาร/พร้อมเพย์) เพื่อแสดงในหน้านักศึกษา
                </p>
                <UploadDropzone
                  endpoint="qrUploader"
                  onClientUploadComplete={async (res) => {
                    if (res && res[0]) {
                      await updateAnnouncementQr(ann.id, res[0].url);
                      await fetchData();
                    }
                  }}
                  onUploadError={(err: Error) => alert(`อัปโหลดไม่สำเร็จ: ${err.message}`)}
                  appearance={{
                    container: "border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/30 rounded-xl p-4 transition-all cursor-pointer",
                    uploadIcon: "text-blue-500 w-8 h-8",
                    label: "text-xs font-semibold text-gray-700 hover:text-blue-600 mt-1",
                    allowedContent: "text-[11px] text-gray-400 mt-0.5",
                    button: "bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-xs mt-2",
                  }}
                  content={{
                    uploadIcon: <QrCode className="w-8 h-8 text-blue-500 mb-1" />,
                    label({ isDragActive }) {
                      return isDragActive
                        ? "วางรูป QR Code ที่นี่"
                        : "ลากรูป QR Code มาวาง หรือคลิกเพื่อเลือกรูป";
                    },
                    allowedContent: "JPG, PNG สูงสุด 4MB",
                    button({ ready, isUploading }) {
                      if (isUploading) return "กำลังอัปโหลด...";
                      return ready ? "อัปโหลด QR Code" : "กำลังโหลด...";
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Summary card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4 pb-3 border-b">สรุปสถานะ</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> ชำระแล้ว</span>
                <span className="font-bold text-green-600">{approved} คน</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-2"><Clock className="w-4 h-4 text-yellow-500" /> รอตรวจสลิป</span>
                <span className="font-bold text-yellow-600">{pending} คน</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-400" /> ยังไม่ชำระ</span>
                <span className="font-bold text-red-500">{unpaid} คน</span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: total > 0 ? `${(approved / total) * 100}%` : "0%" }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{approved}/{total} คน ({total > 0 ? Math.round((approved / total) * 100) : 0}%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Students Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              <h3 className="font-bold text-gray-900">รายชื่อนักศึกษา</h3>
            </div>
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">{total} คน</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-medium text-gray-500 border-b border-gray-100">
                  <th className="p-4 pl-5">รหัสนักศึกษา</th>
                  <th className="p-4">ชื่อ - นามสกุล</th>
                  <th className="p-4 text-center">สถานะ</th>
                  <th className="p-4 text-center">สลิป/ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ann.payments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-gray-400">
                      ยังไม่มีนักศึกษาในระบบ
                    </td>
                  </tr>
                ) : (
                  ann.payments.map((payment: any) => (
                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-5 font-mono text-sm text-gray-700">{payment.user.studentId}</td>
                      <td className="p-4 text-sm text-gray-900 font-medium">
                        {payment.user.firstName} {payment.user.lastName}
                      </td>
                      <td className="p-4 text-center">
                        {payment.status === "APPROVED" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3" /> ชำระแล้ว
                          </span>
                        ) : payment.status === "PENDING" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3" /> รอตรวจสลิป
                          </span>
                        ) : payment.status === "REJECTED" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle className="w-3 h-3" /> ปฏิเสธ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            ยังไม่ชำระ
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {payment.status === "PENDING" ? (
                          <div className="flex flex-col items-center gap-2">
                            {/* Slip thumbnail */}
                            {payment.slipUrl && (
                              <a
                                href={payment.slipUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                                title="คลิกเพื่อดูสลิปขนาดเต็ม"
                              >
                                <img
                                  src={payment.slipUrl}
                                  alt="สลิปโอนเงิน"
                                  className="w-14 h-14 object-cover rounded-lg border border-gray-200 hover:scale-110 transition-transform shadow-sm"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              </a>
                            )}
                            <div className="flex items-center gap-1.5">
                              <button
                                disabled={reviewing === payment.id}
                                onClick={() => handleReview(payment.id, "APPROVED")}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                {reviewing === payment.id ? "..." : "✓ อนุมัติ"}
                              </button>
                              <button
                                disabled={reviewing === payment.id}
                                onClick={() => handleReview(payment.id, "REJECTED")}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
                              >
                                ✗ ปฏิเสธ
                              </button>
                            </div>
                          </div>
                        ) : payment.status === "APPROVED" && payment.slipUrl ? (
                          <a
                            href={payment.slipUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={payment.slipUrl}
                              alt="สลิปโอนเงิน"
                              className="w-10 h-10 object-cover rounded-lg border border-gray-200 mx-auto hover:scale-110 transition-transform"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
