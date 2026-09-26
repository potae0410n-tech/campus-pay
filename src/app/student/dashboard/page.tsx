"use client";

import { CheckCircle2, AlertCircle, Clock, ChevronDown, Loader2, CalendarDays, Bell, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getMyAnnouncements } from "@/actions/announcement";
import { useRouter } from "next/navigation";
import { useViewMode } from "@/context/ViewModeContext";

export default function StudentDashboardPage() {
  const router = useRouter();
  const { currentStudentId, currentUserName } = useViewMode();

  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    if (!currentStudentId) return; // รอให้ context โหลดก่อน
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getMyAnnouncements(currentStudentId);
      if (res.success && res.payments) {
        setPayments(res.payments);
        const first = res.payments.find((p: any) => p.status !== "APPROVED");
        if (first) setSelectedId(first.announcement.id);
        else if (res.payments.length > 0) setSelectedId(res.payments[0].announcement.id);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [currentStudentId]);

  const unpaidPayments = payments.filter(p => p.status === "UNPAID" || p.status === "PENDING" || p.status === "REJECTED");
  const approvedPayments = payments.filter(p => p.status === "APPROVED");
  const selectedPayment = payments.find(p => p.announcement.id === selectedId) || payments[0];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });

  const isOverdue = (due: string) => new Date(due) < new Date();

  const statusBadge = (status: string, dueDate: string) => {
    if (status === "APPROVED") return { label: "ชำระแล้ว", color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
    if (status === "PENDING") return { label: "รอตรวจสลิป", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-3.5 h-3.5" /> };
    if (status === "REJECTED") return { label: "สลิปไม่ผ่าน", color: "bg-red-100 text-red-800", icon: <AlertCircle className="w-3.5 h-3.5" /> };
    if (isOverdue(dueDate)) return { label: "เกินกำหนด", color: "bg-red-100 text-red-800", icon: <AlertCircle className="w-3.5 h-3.5" /> };
    return { label: "รอชำระเงิน", color: "bg-gray-100 text-gray-600", icon: <Clock className="w-3.5 h-3.5" /> };
  };

  // ยังโหลด context อยู่
  if (!currentStudentId) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ภาพรวมการเงินของคุณ</h1>
        <p className="text-gray-500 mt-1 text-sm">{currentUserName} — {currentStudentId}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
          <p className="text-sm text-gray-500 mt-1">รายการทั้งหมด</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-bold text-red-500">{unpaidPayments.length}</p>
          <p className="text-sm text-gray-500 mt-1">ค้างชำระ</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-bold text-green-600">{approvedPayments.length}</p>
          <p className="text-sm text-gray-500 mt-1">ชำระแล้ว</p>
        </div>
      </div>

      {/* Announcement Banner */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : unpaidPayments.length === 0 && approvedPayments.length > 0 ? (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white flex items-center gap-6">
          <CheckCircle2 className="w-14 h-14 opacity-80 shrink-0" />
          <div>
            <h2 className="text-2xl font-bold mb-1">คุณชำระค่ากิจกรรมครบถ้วนแล้ว!</h2>
            <p className="text-green-100 text-sm">ไม่มีรายการที่ค้างชำระอีกแล้วในขณะนี้</p>
          </div>
        </div>
      ) : unpaidPayments.length > 0 && selectedPayment ? (
        <div className="bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10">
            {unpaidPayments.length > 1 && (
              <div className="mb-4">
                <div className="relative inline-block">
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="appearance-none bg-white/20 text-white text-xs font-medium pl-3 pr-8 py-1.5 rounded-lg cursor-pointer focus:outline-none backdrop-blur-sm"
                  >
                    {unpaidPayments.map(p => (
                      <option key={p.announcement.id} value={p.announcement.id} className="text-gray-900">
                        {p.announcement.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm mb-3">
              <Bell className="w-3.5 h-3.5" /> ประกาศใหม่
            </div>
            <h2 className="text-2xl font-bold mb-1">{selectedPayment.announcement.title}</h2>
            {selectedPayment.announcement.description && (
              <p className="text-blue-100 text-sm mb-5 max-w-xl leading-relaxed">{selectedPayment.announcement.description}</p>
            )}

            <div className="flex flex-wrap items-end gap-4">
              <div>
                <p className="text-xs text-blue-200 mb-0.5">ยอดที่ต้องชำระ</p>
                <p className="text-2xl font-bold">฿{selectedPayment.announcement.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-blue-200 mb-0.5">บัญชีที่ต้องโอน</p>
                <p className="font-semibold">{selectedPayment.announcement.bankAccount} ({selectedPayment.announcement.bankName})</p>
              </div>
              <div>
                <p className="text-xs text-blue-200 mb-0.5 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> ครบกำหนด</p>
                <p className={`font-semibold ${isOverdue(selectedPayment.announcement.dueDate) ? "text-red-300" : ""}`}>
                  {formatDate(selectedPayment.announcement.dueDate)}
                </p>
              </div>
              <button
                onClick={() => router.push(`/student/announcements/${selectedPayment.announcement.id}`)}
                className="ml-auto bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-2"
              >
                ดูรายละเอียด / อัปโหลดสลิป <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-gray-700 mb-2">ยังไม่มีประกาศ</h3>
          <p className="text-sm text-gray-400">รอเหรัญญิกสร้างประกาศเก็บเงิน</p>
        </div>
      ) : null}

      {/* All announcements list */}
      {payments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">รายการทั้งหมด</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {payments.map((p) => {
              const badge = statusBadge(p.status, p.announcement.dueDate);
              return (
                <div
                  key={p.id}
                  onClick={() => router.push(`/student/announcements/${p.announcement.id}`)}
                  className="flex items-center justify-between p-4 px-5 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{p.announcement.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                      <CalendarDays className="w-3 h-3" />
                      ครบกำหนด {formatDate(p.announcement.dueDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <p className="font-bold text-gray-900">฿{p.announcement.amount.toFixed(2)}</p>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                      {badge.icon} {badge.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
