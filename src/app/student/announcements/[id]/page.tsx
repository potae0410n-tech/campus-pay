"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAnnouncementById, uploadSlip } from "@/actions/announcement";
import { useViewMode } from "@/context/ViewModeContext";
import {
  ArrowLeft, CreditCard, CheckCircle2, Clock, FileText,
  Loader2, Landmark, AlertCircle, CalendarDays, UploadCloud, Users
} from "lucide-react";

export default function StudentAnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { currentStudentId } = useViewMode();

  const [ann, setAnn] = useState<any>(null);
  const [myPayment, setMyPayment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !myPayment) return;
    setIsUploading(true);
    // prototype: simulate upload URL
    const fakeUrl = `https://example.com/slips/${file.name}`;
    await uploadSlip(myPayment.id, fakeUrl);
    await fetchData();
    setFile(null);
    setIsUploading(false);
  };

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
      <div className={`bg-gradient-to-br ${statusColor} rounded-2xl p-8 text-white relative overflow-hidden`}>
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
          <h1 className="text-3xl font-bold mb-2">{ann.title}</h1>
          {ann.description && (
            <p className="text-blue-100 mb-6 max-w-xl text-sm leading-relaxed">{ann.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl">
              <p className="text-xs text-blue-200 mb-0.5">ยอดที่ต้องชำระ</p>
              <p className="text-2xl font-bold">฿{ann.amount.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl">
              <p className="text-xs text-blue-200 mb-0.5">บัญชีที่ต้องโอน</p>
              <p className="font-semibold">{ann.bankAccount}</p>
              <p className="text-xs text-blue-200">{ann.bankName}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl">
              <p className="text-xs text-blue-200 mb-0.5">กำหนดชำระ</p>
              <p className="font-semibold">{formatDate(ann.startDate)}</p>
              <p className="text-xs text-blue-200">ถึง {formatDate(ann.dueDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4 pb-3 border-b flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-500" />
            อัปโหลดหลักฐานการชำระเงิน
          </h2>

          {myPayment?.status === "APPROVED" ? (
            <div className="text-center py-10 border-2 border-dashed border-green-200 bg-green-50 rounded-xl">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-green-800 mb-1">ชำระเงินครบถ้วนแล้ว!</h3>
              <p className="text-xs text-green-600">เหรัญญิกยืนยันการชำระเงินของคุณแล้ว</p>
            </div>
          ) : myPayment?.status === "PENDING" ? (
            <div className="text-center py-10 border-2 border-dashed border-yellow-200 bg-yellow-50 rounded-xl">
              <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-bold text-yellow-800 mb-1">อยู่ระหว่างการตรวจสอบ</h3>
              <p className="text-xs text-yellow-600">รอเหรัญญิกตรวจสอบสลิปของคุณ</p>
            </div>
          ) : (
            <div className="space-y-4">
              <label
                htmlFor="slip-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-300 transition-all"
              >
                <UploadCloud className="w-8 h-8 text-gray-300 mb-2" />
                {file ? (
                  <p className="font-medium text-blue-600 text-sm px-4 text-center truncate max-w-full">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm text-blue-600 font-semibold">คลิกเพื่ออัปโหลดสลิป</p>
                    <p className="text-xs text-gray-400 mt-1">รองรับ JPG, PNG</p>
                  </>
                )}
                <input id="slip-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>

              <button
                disabled={!file || isUploading}
                onClick={handleUpload}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  file && !isUploading
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> กำลังส่งสลิป...
                  </span>
                ) : (
                  "ยืนยันการส่งสลิป"
                )}
              </button>
            </div>
          )}
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
