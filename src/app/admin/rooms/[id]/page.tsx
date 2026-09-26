"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRoomById } from "@/actions/room";
import { ArrowLeft, Users, CreditCard, CheckCircle2, Clock, FileText, Loader2, Landmark, Lock } from "lucide-react";
import Link from "next/link";

export default function AdminRoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [room, setRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      setIsLoading(true);
      const res = await getRoomById(roomId);
      if (res.success) {
        setRoom(res.room);
      } else {
        alert("ไม่พบห้องนี้");
        router.push("/admin/rooms");
      }
      setIsLoading(false);
    };
    
    if (roomId) fetchRoom();
  }, [roomId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/rooms"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
          <p className="text-gray-500 mt-1">รายละเอียดการเรียกเก็บเงินและสถานะการชำระเงินของนักศึกษา</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Info Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-3">ข้อมูลการเรียกเก็บเงิน</h3>
            <div className="space-y-4">
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-0.5">รหัสผ่านเข้าร่วมห้อง</p>
                  <p className="font-mono text-lg font-bold text-gray-900">{room.password}</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Lock className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              
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

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-3">สรุปสถานะ</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium mb-1">เข้าร่วมแล้ว</p>
                <p className="text-2xl font-bold text-blue-700">{room.payments?.length || 0}</p>
                <p className="text-xs text-blue-500">จาก {room.capacity} คน</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium mb-1">ชำระแล้ว</p>
                <p className="text-2xl font-bold text-green-700">
                  {room.payments?.filter((p: any) => p.status === 'APPROVED').length || 0}
                </p>
                <p className="text-xs text-green-500">คน</p>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              <h3 className="font-bold text-gray-900">รายชื่อนักศึกษาที่เข้าร่วม</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto">
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
                  room.payments.map((payment: any) => (
                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 font-medium text-gray-900">{payment.user.studentId}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="w-12 h-12 text-gray-300 mb-3" />
                        <p>ยังไม่มีนักศึกษาเข้าร่วมห้องนี้</p>
                      </div>
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
