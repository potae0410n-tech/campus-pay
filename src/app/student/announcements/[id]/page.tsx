"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAnnouncementById, uploadSlip } from "@/actions/announcement";
import { useViewMode } from "@/context/ViewModeContext";
import {
  ArrowLeft, CreditCard, CheckCircle2, Clock, FileText,
  Loader2, Landmark, AlertCircle, CalendarDays, UploadCloud, Users,
  ImageIcon, ExternalLink, QrCode, Copy, Check
} from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import generatePayload from "promptpay-qr";
import { QRCodeSVG } from "qrcode.react";

export default function StudentAnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { currentStudentId } = useViewMode();

  const [ann, setAnn] = useState<any>(null);
  const [myPayment, setMyPayment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getAnnouncementById(id);
    if (res.success && res.announcement) {
      setAnn(res.announcement);
      const me = res.announcement.payments.find(
        (p: any) => p.user.studentId === currentStudentId
      );
      setMyPayment(me || null);
    }
    setIsLoading(false);
  };

  useEffect(() => { if (id) fetchData(); }, [id]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });

  const isOverdue = ann ? new Date(ann.dueDate) < new Date() : false;
  const daysLeft = ann
    ? Math.ceil((new Date(ann.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  if (!ann) return null;

  const statusColor = myPayment?.status === "APPROVED"
    ? "from-green-600 to-green-500"
    : isOverdue
    ? "from-red-600 to-red-500"
    : "from-blue-700 to-blue-500";

  const cleanAccount = ann?.bankAccount ? ann.bankAccount.replace(/[^0-9]/g, "") : "";
  const isValidPromptPay = cleanAccount.length === 10 || cleanAccount.length === 13;
  let qrPayload = "";
  if (isValidPromptPay && ann?.amount) {
    try {
      qrPayload = generatePayload(cleanAccount, { amount: Number(ann.amount) });
    } catch (e) {
      console.error("PromptPay QR generation error:", e);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Back */}
      <button
        onClick={() => router.push("/student/dashboard")}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> กลับไปหน้าแดชบอร์ด
      </button>

      {/* Hero Banner */}
      <div className={`bg-gradient-to-br ${statusColor} rounded-2xl p-6 md:p-8 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm mb-4">
            {myPayment?.status === "APPROVED" ? (
              <><CheckCircle2 className="w-3.5 h-3.5" /> ชำระแล้ว</>
            ) : myPayment?.status === "PENDING" ? (
              <><Clock className="w-3.5 h-3.5" /> รอเหรัญญิกตรวจสอบ</>
            ) : isOverdue ? (
              <><AlertCircle className="w-3.5 h-3.5" /> เกินกำหนดชำระ</>
            ) : (
              <><Clock className="w-3.5 h-3.5" /> เหลือ {daysLeft} วัน</>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{ann.title}</h1>
          {ann.description && (
            <p className="text-blue-100 mb-6 max-w-xl text-sm leading-relaxed">{ann.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
              <p className="text-xs text-blue-200 mb-0.5">ยอดที่ต้องชำระ</p>
              <p className="text-2xl font-bold">฿{ann.amount.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
              <p className="text-xs text-blue-200 mb-0.5">บัญชีที่ต้องโอน</p>
              <p className="font-semibold">{ann.bankAccount}</p>
              <p className="text-xs text-blue-200">{ann.bankName}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
              <p className="text-xs text-blue-200 mb-0.5">กำหนดชำระ</p>
              <p className="font-semibold text-sm">{formatDate(ann.startDate)}</p>
              <p className="text-xs text-blue-200">ถึง {formatDate(ann.dueDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: PromptPay QR Code & Account Info */}
        <div className="space-y-6">
          {/* PromptPay Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-[#003B70] px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 font-bold text-sm">
                <QrCode className="w-5 h-5 text-sky-300" />
                <span>สแกนจ่ายผ่าน PromptPay</span>
              </div>
              <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-medium">พร้อมเพย์</span>
            </div>

            <div className="p-6 text-center flex flex-col items-center">
              {qrPayload ? (
                <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100 flex flex-col items-center mb-4">
                  <QRCodeSVG value={qrPayload} size={190} level="M" />
                  <p className="mt-3 text-xs font-semibold text-gray-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    ยอดชำระ: ฿{ann.amount.toFixed(2)}
                  </p>
                </div>
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400 mb-4 border border-dashed border-gray-300">
                  <Landmark className="w-10 h-10 mb-2 text-gray-300" />
                  <p className="text-xs">โอนผ่านเลขบัญชีด้านล่าง</p>
                </div>
              )}

              {/* Bank Account Details + Copy */}
              <div className="w-full bg-gray-50 rounded-xl p-3.5 border border-gray-200 flex items-center justify-between gap-3">
                <div className="text-left">
                  <p className="text-[11px] text-gray-500 font-medium">เลขบัญชี / เบอร์พร้อมเพย์</p>
                  <p className="font-bold text-gray-900 text-sm tracking-wide">{ann.bankAccount}</p>
                  <p className="text-xs text-gray-600">{ann.bankName}</p>
                </div>
                <button
                  onClick={() => handleCopyAccount(ann.bankAccount)}
                  className="flex items-center gap-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">คัดลอกแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                      <span>คัดลอก</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 pb-3 border-b flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-500" />
              อัปโหลดหลักฐานการชำระเงิน
            </h2>

          {myPayment?.status === "APPROVED" ? (
            <div className="text-center py-10 border-2 border-dashed border-green-200 bg-green-50 rounded-xl">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-green-800 mb-1">ชำระเงินครบถ้วนแล้ว!</h3>
              <p className="text-xs text-green-600">เหรัญญิกยืนยันการชำระเงินของคุณแล้ว</p>
              {myPayment?.slipUrl && (
                <a
                  href={myPayment.slipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-xs text-green-700 hover:text-green-900 underline"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> ดูสลิปที่ส่งไป
                </a>
              )}
            </div>
          ) : myPayment?.status === "PENDING" ? (
            <div className="space-y-4">
              <div className="text-center py-8 border-2 border-dashed border-yellow-200 bg-yellow-50 rounded-xl">
                <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-bold text-yellow-800 mb-1">อยู่ระหว่างการตรวจสอบ</h3>
                <p className="text-xs text-yellow-600">รอเหรัญญิกตรวจสอบสลิปของคุณ</p>
              </div>
              {myPayment?.slipUrl && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 font-medium">สลิปที่คุณส่ง:</p>
                  <div className="relative">
                    <img
                      src={myPayment.slipUrl}
                      alt="สลิปโอนเงิน"
                      className="w-full rounded-lg object-contain max-h-48 border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <a
                      href={myPayment.slipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg shadow text-gray-600 hover:text-blue-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : uploadSuccess ? (
            <div className="text-center py-10 border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl">
              <CheckCircle2 className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold text-blue-800 mb-1">ส่งสลิปเรียบร้อย!</h3>
              <p className="text-xs text-blue-600">รอเหรัญญิกตรวจสอบสักครู่นะครับ</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                ถ่ายรูปหรือเลือกไฟล์สลิปโอนเงินจากกล้อง/คลังภาพ แล้วกดอัปโหลดได้เลยครับ
              </p>

              {/* Uploadthing Upload Button */}
              <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 p-6 hover:border-blue-300 transition-colors">
                <UploadCloud className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 mb-4">เลือกหรือถ่ายรูปสลิปโอนเงิน</p>
                <UploadButton
                  endpoint="slipUploader"
                  onClientUploadComplete={async (res) => {
                    if (res && res[0] && myPayment) {
                      await uploadSlip(myPayment.id, res[0].url);
                      setUploadSuccess(true);
                      await fetchData();
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`อัปโหลดไม่สำเร็จ: ${error.message}`);
                  }}
                  appearance={{
                    button: "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md",
                    allowedContent: "text-xs text-gray-400 mt-1",
                  }}
                  content={{
                    button({ ready }) {
                      return ready ? "📎 เลือกรูปสลิป" : "กำลังโหลด...";
                    },
                    allowedContent: "JPG, PNG สูงสุด 4MB",
                  }}
                />
              </div>

              <p className="text-xs text-gray-400 text-center">
                * รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 4MB
              </p>
            </div>
          )}
        </div>
      </div>

        {/* รายชื่อเพื่อนในประกาศ */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <Users className="w-4 h-4 text-gray-500" />
            <h2 className="font-bold text-gray-900">สถานะเพื่อนๆ</h2>
            <span className="ml-auto text-xs text-gray-400">{ann.payments.length} คน</span>
          </div>
          <div className="overflow-y-auto max-h-72">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">ชื่อ</th>
                  <th className="px-4 py-3 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ann.payments.map((p: any) => {
                  const isMe = p.user.studentId === currentStudentId;
                  return (
                    <tr key={p.id} className={isMe ? "bg-blue-50/40" : "hover:bg-gray-50/50"}>
                      <td className="px-4 py-2.5">
                        <span className="font-medium text-gray-900">{p.user.firstName} {p.user.lastName}</span>
                        {isMe && <span className="ml-1.5 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">ฉัน</span>}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {p.status === "APPROVED" ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700"><CheckCircle2 className="w-3 h-3" /> ชำระแล้ว</span>
                        ) : p.status === "PENDING" ? (
                          <span className="inline-flex items-center gap-1 text-xs text-yellow-600"><Clock className="w-3 h-3" /> รอตรวจ</span>
                        ) : (
                          <span className="text-xs text-gray-400">ยังไม่ชำระ</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
