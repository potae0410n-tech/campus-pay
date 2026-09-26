"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Bell, ChevronRight, CheckCircle2, Clock, AlertCircle, Loader2, Users, CalendarDays } from "lucide-react";
import { getAnnouncements } from "@/actions/announcement";
import { useRouter } from "next/navigation";
import CreateAnnouncementModal from "@/components/CreateAnnouncementModal";

export default function AdminAnnouncementsPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const res = await getAnnouncements();
    if (res.success && res.announcements) {
      setAnnouncements(res.announcements);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getStatusSummary = (payments: any[]) => {
    const approved = payments.filter(p => p.status === "APPROVED").length;
    const pending = payments.filter(p => p.status === "PENDING").length;
    const unpaid = payments.filter(p => p.status === "UNPAID").length;
    return { approved, pending, unpaid };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("th-TH", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ประกาศเก็บเงิน</h1>
          <p className="text-gray-500 mt-1">จัดการรายการเรียกเก็บเงินจากนักศึกษา</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" /> สร้างประกาศใหม่
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">ยังไม่มีประกาศ</h3>
          <p className="text-gray-500 text-sm mb-6">สร้างประกาศเก็บเงินแรกของคุณ</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> สร้างประกาศใหม่
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann) => {
            const { approved, pending, unpaid } = getStatusSummary(ann.payments);
            const total = ann.payments.length;
            const progress = total > 0 ? (approved / total) * 100 : 0;
            const isOverdue = new Date(ann.dueDate) < new Date();

            return (
              <div
                key={ann.id}
                onClick={() => router.push(`/admin/announcements/${ann.id}`)}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{ann.title}</h3>
                      {isOverdue && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium shrink-0">เกินกำหนด</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate mb-3">{ann.description || "ไม่มีรายละเอียดเพิ่มเติม"}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="font-bold text-blue-600 text-sm">฿{ann.amount.toFixed(2)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {total} คน
                      </span>
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {approved} ชำระแล้ว
                      </span>
                      {pending > 0 && (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <Clock className="w-3.5 h-3.5" /> {pending} รอตรวจ
                        </span>
                      )}
                      {unpaid > 0 && (
                        <span className="flex items-center gap-1 text-red-500">
                          <AlertCircle className="w-3.5 h-3.5" /> {unpaid} ยังไม่ชำระ
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-gray-400">
                        <CalendarDays className="w-3.5 h-3.5" />
                        ครบกำหนด {formatDate(ann.dueDate)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    {total > 0 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{approved}/{total} คน ชำระแล้ว ({Math.round(progress)}%)</p>
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 shrink-0 mt-1 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateAnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchData}
      />
    </div>
  );
}
