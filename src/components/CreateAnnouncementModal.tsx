"use client";

import { useState } from "react";
import { X, Loader2, CalendarDays, CreditCard, Info, DollarSign, Building, QrCode } from "lucide-react";
import { createAnnouncement } from "@/actions/announcement";
import { UploadButton } from "@/lib/uploadthing";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateAnnouncementModal({ isOpen, onClose, onCreated }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    bankAccount: "",
    bankName: "",
    startDate: "",
    dueDate: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await createAnnouncement({
      title: form.title,
      description: form.description,
      amount: parseFloat(form.amount),
      bankAccount: form.bankAccount,
      bankName: form.bankName,
      startDate: form.startDate,
      dueDate: form.dueDate,
      qrCodeUrl: qrCodeUrl || undefined,
    });

    if (res.success) {
      onCreated();
      onClose();
      setQrCodeUrl("");
      setForm({ title: "", description: "", amount: "", bankAccount: "", bankName: "", startDate: "", dueDate: "" });
    } else {
      alert("เกิดข้อผิดพลาด: " + res.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">สร้างประกาศเก็บเงินใหม่</h2>
            <p className="text-sm text-gray-500 mt-0.5">ระบบจะส่งไปยังนักศึกษาทุกคนอัตโนมัติ</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-500" /> ชื่อรายการ
            </label>
            <input
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="เช่น ค่าเสื้อสาขา 2567"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">รายละเอียดเพิ่มเติม</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="รายละเอียดของรายการเก็บเงินนี้..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none transition-colors"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-blue-500" /> จำนวนเงิน (บาท)
            </label>
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.amount}
              onChange={handleChange}
              placeholder="350.00"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors"
            />
          </div>

          {/* Bank Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-blue-500" /> เลขบัญชี
              </label>
              <input
                name="bankAccount"
                required
                value={form.bankAccount}
                onChange={handleChange}
                placeholder="123-4-56789-0"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-500" /> ธนาคาร
              </label>
              <input
                name="bankName"
                required
                value={form.bankName}
                onChange={handleChange}
                placeholder="กสิกรไทย"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-blue-500" /> วันเริ่มต้น
              </label>
              <input
                name="startDate"
                type="date"
                required
                value={form.startDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-red-500" /> กำหนดชำระ
              </label>
              <input
                name="dueDate"
                type="date"
                required
                value={form.dueDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors"
              />
            </div>
          </div>

          {/* QR Code Upload (Optional) */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-blue-500" /> รูปภาพ QR Code สำหรับสแกนจ่าย (ไม่บังคับ)
            </label>
            <p className="text-xs text-gray-500 mb-3">หากมีรูป QR Code พร้อมเพย์ หรือ ธนาคาร สามารถอัปโหลดไว้ให้นักศึกษาสแกนได้ทันที</p>
            {qrCodeUrl ? (
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-gray-200">
                <img src={qrCodeUrl} alt="QR Code" className="w-14 h-14 object-contain rounded border border-gray-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-green-700">✓ อัปโหลดรูป QR เรียบร้อย</p>
                  <button
                    type="button"
                    onClick={() => setQrCodeUrl("")}
                    className="text-xs text-red-500 hover:text-red-700 mt-1 underline"
                  >
                    ลบรูปนี้
                  </button>
                </div>
              </div>
            ) : (
              <UploadButton
                endpoint="qrUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) setQrCodeUrl(res[0].url);
                }}
                onUploadError={(err: Error) => alert(`อัปโหลดไม่สำเร็จ: ${err.message}`)}
                appearance={{
                  button: "bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors",
                  allowedContent: "text-[11px] text-gray-400 mt-1",
                }}
                content={{
                  button: "📷 เลือกรูป QR Code",
                  allowedContent: "JPG, PNG สูงสุด 4MB",
                }}
              />
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> กำลังสร้างประกาศ...</>
              ) : (
                "สร้างประกาศ & ส่งหานักศึกษาทุกคน"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
