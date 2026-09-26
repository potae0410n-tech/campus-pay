"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRoomById } from "@/actions/room";
import { ArrowLeft, Users, CreditCard, CheckCircle2, Clock, FileText, Loader2, Landmark, UploadCloud, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function StudentRoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [room, setRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      setIsLoading(true);
      const res = await getRoomById(roomId);
      if (res.success) {
        setRoom(res.room);
      } else {
        alert("ไม่พบห้องนี้");
        router.push("/student/dashboard");
      }
      setIsLoading(false);
    };
    
    if (roomId) fetchRoom();
  }, [roomId, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    // จำลองการอัปโหลด
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!room) return null;

  // จำลองว่านักศึกษาที่ล็อกอินอยู่คือ สมชาย (650000000000)
  const myPayment = room.payments?.find((p: any) => p.user.studentId === "650000000000");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/student/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
            <p className="text-gray-500 mt-1">รายละเอียดกิจกรรมและรายชื่อผู้เข้าร่วม</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Info Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-3">ข้อมูลการเรียกเก็บเงิน</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> รายละเอียด
                </p>
                <p className="font-medium text-gray-900">{room.description || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> ยอดเงิน (บาท)
                </p>
                <p className="font-bold text-xl text-blue-600">฿{room.amount.toFixed(2)}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                  <Landmark className="w-4 h-4" /> บัญชีที่รับโอน
                </p>
                <p className="font-medium text-gray-900">{room.bankAccount}</p>
                <p className="text-sm text-gray-500">{room.bankName}</p>
              </div>
            </div>
          </div>

          {/* Upload Slip Section */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-3">ส่งหลักฐานการชำระเงิน</h3>
            {isSuccess || myPayment?.status === 'APPROVED' ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-green-200 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-green-800 mb-1">ส่งหลักฐานแล้ว!</h3>
                <p className="text-xs text-green-600">รอเหรัญญิกตรวจสอบความถูกต้อง</p>
              </div>
            ) : (
              <div className="space-y-4">
                <label 
                  htmlFor="slip-upload" 
                  className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center text-center px-4">
                    <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                    {file ? (
                      <p className="font-medium text-blue-600 text-sm truncate w-full max-w-[200px]">{file.name}</p>
                    ) : (
                      <>
                        <p className="mb-1 text-sm text-blue-600 font-semibold">
                          อัปโหลดสลิป
                        </p>
                        <p className="text-xs text-gray-400">JPG, PNG</p>
                      </>
                    )}
                  </div>
                  <input 
                    id="slip-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                  />
                </label>

                <button
                  disabled={!file || isUploading}
                  onClick={handleUpload}
                  className={`w-full py-2.5 rounded-lg font-medium transition-colors text-sm ${
                    file && !isUploading 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isUploading ? "กำลังอัปโหลด..." : "ยืนยันการส่งสลิป"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Students List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              <h3 className="font-bold text-gray-900">เพื่อนที่เข้าร่วมห้องนี้</h3>
            </div>
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              {room.payments?.length || 0} / {room.capacity} คน
            </span>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-sm font-medium text-gray-500">
                  <th className="p-4 pl-6">รหัสนักศึกษา</th>
                  <th className="p-4">ชื่อ - นามสกุล</th>
                  <th className="p-4 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {room.payments && room.payments.length > 0 ? (
                  room.payments.map((payment: any) => {
                    const isMe = payment.user.studentId === "650000000000";
                    return (
                      <tr 
                        key={payment.id} 
                        className={`transition-colors ${isMe ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}
                      >
                        <td className="p-4 pl-6 font-medium text-gray-900">
                          {payment.user.studentId}
                          {isMe && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">ฉัน</span>}
                        </td>
                        <td className="p-4 text-gray-600">
                          {payment.user.firstName} {payment.user.lastName}
                        </td>
                        <td className="p-4 text-center">
                          {payment.status === 'APPROVED' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle2 className="w-3.5 h-3.5" /> ชำระแล้ว
                            </span>
                          ) : payment.status === 'PENDING' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="w-3.5 h-3.5" /> รอตรวจสอบสลิป
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertCircle className="w-3.5 h-3.5" /> ยังไม่ชำระ / ไม่ผ่าน
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="p-12 text-center text-gray-500">
                      ยังไม่มีนักศึกษาเข้าร่วมห้องนี้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
