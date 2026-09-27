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
import { UploadButton, UploadDropzone, useUploadThing } from "@/lib/uploadthing";
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
  const [showStudentList, setShowStudentList] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditingSlip, setIsEditingSlip] = useState(false);

  const { startUpload, isUploading } = useUploadThing("slipUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res[0] && myPayment) {
        await uploadSlip(myPayment.id, res[0].url);
        setUploadSuccess(true);
        setIsEditingSlip(false);
        await fetchData();
      }
    },
    onUploadError: (error) => {
      alert(`อัปโหลดไม่สำเร็จ: ${error.message}`);
    },
  });

  const handleFiles = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพ เช่น JPG, PNG");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert("ไฟล์รูปภาพต้องมีขนาดไม่เกิน 4MB");
      return;
    }
    await startUpload([file]);
  };

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
              {ann.qrCodeUrl ? (
                <div className="bg-white p-3 rounded-2xl shadow-inner border border-gray-100 flex flex-col items-center mb-4">
                  <img
                    src={ann.qrCodeUrl}
                    alt="QR Code สำหรับชำระเงิน"
                    className="w-52 h-52 object-contain rounded-xl border border-gray-200 bg-white"
                  />
                  <p className="mt-2.5 text-xs font-semibold text-gray-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    ยอดชำระ: ฿{ann.amount.toFixed(2)}
                  </p>
                </div>
              ) : qrPayload ? (
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
              <div className="text-center py-6 border-2 border-dashed border-yellow-200 bg-yellow-50 rounded-xl">
                <Clock className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-bold text-yellow-800 text-sm mb-0.5">อยู่ระหว่างการตรวจสอบ</h3>
                <p className="text-xs text-yellow-600">เหรัญญิกกำลังตรวจสอบสลิปของคุณ</p>
              </div>

              {myPayment?.slipUrl && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-600 font-medium">สลิปที่คุณส่ง:</p>
                    <button
                      type="button"
                      onClick={() => setIsEditingSlip(!isEditingSlip)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors border border-blue-100 shadow-xs"
                    >
                      {isEditingSlip ? "✕ ยกเลิก" : "🔄 แก้ไข / ส่งสลิปใหม่"}
                    </button>
                  </div>
                  <div className="relative">
                    <img
                      src={myPayment.slipUrl}
                      alt="สลิปโอนเงิน"
                      className="w-full rounded-lg object-contain max-h-48 border border-gray-200 bg-white"
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

              {/* ส่วนแก้ไขสลิป */}
              {isEditingSlip && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-700">ลากหรือเลือกรูปสลิปใหม่เพื่อแทนที่อันเดิม:</p>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      handleFiles(e.dataTransfer.files);
                    }}
                    onClick={() => {
                      if (!isUploading) {
                        document.getElementById("slip-file-input-edit")?.click();
                      }
                    }}
                    className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center min-h-[160px] text-center cursor-pointer ${
                      isDragOver
                        ? "border-blue-600 bg-blue-100/60 scale-[1.01]"
                        : "border-blue-200 hover:border-blue-400 bg-blue-50/30"
                    }`}
                  >
                    <input
                      id="slip-file-input-edit"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) handleFiles(e.target.files);
                      }}
                    />

                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2.5 py-4">
                        <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">กำลังอัปโหลดสลิปใหม่...</p>
                          <p className="text-xs text-gray-500 mt-0.5">กรุณารอสักครู่</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <UploadCloud className="w-9 h-9 text-blue-500 mb-2" />
                        <p className="text-sm font-bold text-gray-800">
                          {isDragOver ? "วางสลิปใหม่ตรงนี้ได้เลย!" : "ลากสลิปใหม่มาวาง หรือคลิกเลือกรูป"}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">อัปโหลดทันที ไม่ต้องกดยืนยัน</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : uploadSuccess ? (
            <div className="space-y-4">
              <div className="text-center py-8 border-2 border-dashed border-green-200 bg-green-50 rounded-xl">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-green-800 mb-1">ส่งสลิปเรียบร้อย!</h3>
                <p className="text-xs text-green-600">รอเหรัญญิกตรวจสอบสักครู่นะครับ</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUploadSuccess(false);
                  setIsEditingSlip(true);
                }}
                className="w-full py-2 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100"
              >
                🔄 ต้องการแก้ไขหรือเปลี่ยนรูปสลิป
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                ลากรูปภาพสลิปมาวาง หรือคลิกเลือกไฟล์เพื่ออัปโหลดได้ทันทีครับ
              </p>

              {/* Instant Auto-Upload Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  handleFiles(e.dataTransfer.files);
                }}
                onClick={() => {
                  if (!isUploading) {
                    document.getElementById("slip-file-input")?.click();
                  }
                }}
                className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center min-h-[190px] text-center cursor-pointer ${
                  isDragOver
                    ? "border-blue-600 bg-blue-100/60 scale-[1.01]"
                    : "border-blue-200 hover:border-blue-400 bg-blue-50/30"
                }`}
              >
                <input
                  id="slip-file-input"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleFiles(e.target.files);
                  }}
                />

                {isUploading ? (
                  <div className="flex flex-col items-center gap-2.5 py-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">กำลังอัปโหลดสลิป...</p>
                      <p className="text-xs text-gray-500 mt-0.5">กรุณารอสักครู่ ระบบกำลังส่งให้เหรัญญิก</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 transition-colors ${
                      isDragOver ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
                    }`}>
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      {isDragOver ? "วางรูปสลิปตรงนี้ได้เลย!" : "ลากรูปสลิปมาวางที่นี่"}
                    </p>
                    <p className="text-xs text-blue-600 font-semibold mt-1">
                      หรือคลิกเพื่อเลือกรูปภาพจากเครื่อง
                    </p>
                    <p className="text-[11px] text-gray-400 mt-2">
                      รองรับ JPG, PNG ขนาดไม่เกิน 4MB (อัปโหลดอัตโนมัติทันที ไม่ต้องกดปุ่มยืนยัน)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

        {/* สรุปยอดชำระ + ปุ่มดูรายชื่อ */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <Users className="w-4 h-4 text-gray-500" />
            <h2 className="font-bold text-gray-900">สรุปยอดชำระ</h2>
            <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{ann.payments.length} คน</span>
          </div>
          <div className="p-5 space-y-3">
            {/* สรุปสถิติ */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-green-700">{ann.payments.filter((p: any) => p.status === "APPROVED").length}</p>
                <p className="text-[11px] text-green-600 font-medium mt-0.5">ชำระแล้ว</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-yellow-600">{ann.payments.filter((p: any) => p.status === "PENDING").length}</p>
                <p className="text-[11px] text-yellow-600 font-medium mt-0.5">รอตรวจ</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-gray-500">{ann.payments.filter((p: any) => p.status !== "APPROVED" && p.status !== "PENDING").length}</p>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">ยังไม่ชำระ</p>
              </div>
            </div>

            {/* แถบความคืบหน้า */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>ความคืบหน้าการชำระเงิน</span>
                <span className="font-semibold text-gray-700">
                  {ann.payments.length > 0
                    ? Math.round((ann.payments.filter((p: any) => p.status === "APPROVED").length / ann.payments.length) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: ann.payments.length > 0
                      ? `${(ann.payments.filter((p: any) => p.status === "APPROVED").length / ann.payments.length) * 100}%`
                      : "0%"
                  }}
                />
              </div>
            </div>

            {/* ปุ่มดูรายชื่อ */}
            <button
              onClick={() => setShowStudentList(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-100 transition-colors"
            >
              <Users className="w-4 h-4" />
              ดูรายชื่อนักศึกษาทั้งหมด
            </button>
          </div>
        </div>
      </div>

      {/* Modal รายชื่อนักศึกษาทั้งหมด */}
      {showStudentList && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowStudentList(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/80">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">รายชื่อนักศึกษา</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{ann.payments.length} คน</span>
              </div>
              <button
                onClick={() => setShowStudentList(false)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Notice */}
            <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">ข้อมูลนี้จะแสดงเฉพาะสถานะ ไม่เปิดเผยรายละเอียดสลิปของเพื่อนร่วมรายการ</p>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 border-b border-gray-100 sticky top-0 bg-white">
                  <tr>
                    <th className="px-4 py-3 text-left w-8">#</th>
                    <th className="px-4 py-3 text-left">ชื่อ - นามสกุล</th>
                    <th className="px-4 py-3 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ann.payments.map((p: any, idx: number) => {
                    const isMe = p.user.studentId === currentStudentId;
                    return (
                      <tr key={p.id} className={isMe ? "bg-blue-50/60" : "hover:bg-gray-50/50"}>
                        <td className="px-4 py-3 text-xs text-gray-400 font-medium">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ backgroundColor: isMe ? "#2563eb" : `hsl(${(p.user.firstName.charCodeAt(0) * 37) % 360}, 55%, 55%)` }}
                            >
                              {p.user.firstName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm leading-tight">{p.user.firstName} {p.user.lastName}</p>
                              {isMe && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">ฉัน</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {p.status === "APPROVED" ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full font-medium">
                              <CheckCircle2 className="w-3 h-3" /> ชำระแล้ว
                            </span>
                          ) : p.status === "PENDING" ? (
                            <span className="inline-flex items-center gap-1 text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full font-medium">
                              <Clock className="w-3 h-3" /> รอตรวจ
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                              ยังไม่ชำระ
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button
                onClick={() => setShowStudentList(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
