"use client";

import { useEffect, useState } from "react";
import { getMyPaymentHistory } from "@/actions/announcement";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  CalendarDays,
  Receipt,
  Loader2,
  Image as ImageIcon,
  X,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useViewMode } from "@/context/ViewModeContext";

export default function StudentHistoryPage() {
  const router = useRouter();
  const { currentStudentId, currentUserName } = useViewMode();
  const [payments, setPayments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewSlip, setPreviewSlip] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  useEffect(() => {
    if (!currentStudentId) return;
    const fetch = async () => {
      setIsLoading(true);
      const res = await getMyPaymentHistory(currentStudentId);
      if (res.success && res.payments) {
        setPayments(res.payments);
        setUser(res.user);
      }
      setIsLoading(false);
    };
    fetch();
  }, [currentStudentId]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const isOverdue = (due: string) => new Date(due) < new Date();

  const getStatusConfig = (status: string, dueDate: string) => {
    switch (status) {
      case "APPROVED":
        return {
          label: "อนุมัติแล้ว",
          sublabel: "เหรัญญิกยืนยันการชำระเงินแล้ว",
          color: "text-green-700",
          bg: "bg-green-50 border-green-200",
          badge: "bg-green-100 text-green-700",
          icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
          dot: "bg-green-500",
        };
      case "PENDING":
        return {
          label: "รอตรวจสอบ",
          sublabel: "เหรัญญิกกำลังตรวจสอบสลิปของคุณ",
          color: "text-yellow-700",
          bg: "bg-yellow-50 border-yellow-200",
          badge: "bg-yellow-100 text-yellow-700",
          icon: <Clock className="w-5 h-5 text-yellow-600" />,
          dot: "bg-yellow-400",
        };
      case "REJECTED":
        return {
          label: "สลิปไม่ผ่าน",
          sublabel: "กรุณาอัปโหลดสลิปใหม่อีกครั้ง",
          color: "text-red-700",
          bg: "bg-red-50 border-red-200",
          badge: "bg-red-100 text-red-700",
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          dot: "bg-red-500",
        };
      default:
        if (isOverdue(dueDate)) {
          return {
            label: "เกินกำหนด",
            sublabel: "หมดเวลาชำระแล้ว",
            color: "text-red-700",
            bg: "bg-red-50 border-red-200",
            badge: "bg-red-100 text-red-700",
            icon: <AlertCircle className="w-5 h-5 text-red-500" />,
            dot: "bg-red-400",
          };
        }
        return {
          label: "รอชำระเงิน",
          sublabel: "ยังไม่ได้ชำระเงิน",
          color: "text-gray-600",
          bg: "bg-gray-50 border-gray-200",
          badge: "bg-gray-100 text-gray-600",
          icon: <Clock className="w-5 h-5 text-gray-400" />,
          dot: "bg-gray-400",
        };
    }
  };

  const filters = [
    { key: "ALL", label: "ทั้งหมด" },
    { key: "APPROVED", label: "อนุมัติแล้ว" },
    { key: "PENDING", label: "รอตรวจสอบ" },
    { key: "REJECTED", label: "ไม่ผ่าน" },
    { key: "UNPAID", label: "ยังไม่ชำระ" },
  ];

  const filtered =
    activeFilter === "ALL"
      ? payments
      : activeFilter === "UNPAID"
      ? payments.filter((p) => p.status === "UNPAID" || p.status === "REJECTED")
      : payments.filter((p) => p.status === activeFilter);

  const approvedCount = payments.filter((p) => p.status === "APPROVED").length;
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;
  const unpaidCount = payments.filter(
    (p) => p.status === "UNPAID" || p.status === "REJECTED"
  ).length;
  const totalPaid = payments
    .filter((p) => p.status === "APPROVED")
    .reduce((sum, p) => sum + p.announcement.amount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Receipt className="w-7 h-7 text-blue-600" />
          ประวัติการชำระเงิน
        </h1>
        {user && (
          <p className="text-gray-500 mt-1 text-sm">
            {user.firstName} {user.lastName} — {user.studentId}
          </p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
          <p className="text-xs text-gray-500 mt-1">รายการทั้งหมด</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
          <p className="text-xs text-gray-500 mt-1">อนุมัติแล้ว</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
          <p className="text-xs text-gray-500 mt-1">รอตรวจสอบ</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">฿{totalPaid.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">ยอดชำระทั้งหมด</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === f.key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {f.label}
            {f.key !== "ALL" && (
              <span className="ml-1.5 text-xs opacity-70">
                (
                {f.key === "UNPAID"
                  ? unpaidCount
                  : f.key === "APPROVED"
                  ? approvedCount
                  : f.key === "PENDING"
                  ? pendingCount
                  : payments.filter((p) => p.status === f.key).length}
                )
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="font-semibold text-gray-700">ไม่มีรายการ</p>
          <p className="text-sm text-gray-400 mt-1">ยังไม่มีประวัติการชำระเงินในหมวดนี้</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((p) => {
            const cfg = getStatusConfig(p.status, p.announcement.dueDate);
            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${cfg.bg}`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="mt-0.5">{cfg.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900 truncate">
                            {p.announcement.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${cfg.color}`}>{cfg.sublabel}</p>

                        {/* Dates */}
                        <div className="flex flex-wrap gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>กำหนดชำระ: {formatDate(p.announcement.dueDate)}</span>
                          </div>
                          {p.createdAt && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Clock className="w-3.5 h-3.5" />
                              <span>อัปเดต: {formatDateTime(p.updatedAt || p.createdAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-gray-900">
                        ฿{p.announcement.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.announcement.bankName}</p>
                    </div>
                  </div>

                  {/* Slip section */}
                  {p.slipUrl ? (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2 font-medium">หลักฐานการชำระเงิน</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setPreviewSlip(p.slipUrl)}
                          className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all"
                        >
                          <ImageIcon className="w-4 h-4" />
                          ดูสลิปที่อัปโหลด
                        </button>
                        {p.status === "PENDING" && (
                          <span className="text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 px-2.5 py-1.5 rounded-lg">
                            ⏳ รอเหรัญญิกตรวจสอบ...
                          </span>
                        )}
                        {p.status === "APPROVED" && (
                          <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2.5 py-1.5 rounded-lg">
                            ✅ ได้รับการอนุมัติแล้ว
                          </span>
                        )}
                        {p.status === "REJECTED" && (
                          <span className="text-xs text-red-600 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg">
                            ❌ สลิปไม่ผ่าน — กรุณาส่งใหม่
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    p.status !== "APPROVED" && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() =>
                            router.push(`/student/announcements/${p.announcement.id}`)
                          }
                          className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                        >
                          อัปโหลดสลิปเพื่อชำระเงิน
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slip Preview Modal */}
      {previewSlip && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewSlip(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-gray-900">สลิปการชำระเงิน</h3>
              <button
                onClick={() => setPreviewSlip(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSlip}
                alt="สลิปการชำระเงิน"
                className="w-full rounded-xl object-contain max-h-[60vh]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='155' text-anchor='middle' fill='%239ca3af' font-size='14' font-family='sans-serif'%3Eไม่สามารถแสดงรูปภาพได้%3C/text%3E%3C/svg%3E";
                }}
              />
              <p className="text-xs text-gray-400 text-center mt-3 break-all">{previewSlip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
