"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllPaymentHistory } from "@/actions/announcement";
import {
  Receipt,
  Loader2,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  X,
  ExternalLink,
  Banknote,
} from "lucide-react";

const STATUS_FILTERS = [
  { key: "ALL", label: "ทั้งหมด" },
  { key: "APPROVED", label: "ชำระแล้ว" },
  { key: "PENDING", label: "รอตรวจสอบ" },
  { key: "REJECTED", label: "สลิปไม่ผ่าน" },
  { key: "UNPAID", label: "ยังไม่ชำระ" },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "APPROVED")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
        <CheckCircle2 className="w-3 h-3" /> ชำระแล้ว
      </span>
    );
  if (status === "PENDING")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 whitespace-nowrap">
        <Clock className="w-3 h-3" /> รอตรวจสอบ
      </span>
    );
  if (status === "REJECTED")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 whitespace-nowrap">
        <XCircle className="w-3 h-3" /> สลิปไม่ผ่าน
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
      <AlertCircle className="w-3 h-3" /> ยังไม่ชำระ
    </span>
  );
}

export default function AdminHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [announcementFilter, setAnnouncementFilter] = useState("ALL");
  const [preview, setPreview] = useState<{ url: string; name: string; title: string } | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const res = await getAllPaymentHistory();
      if (res.success && res.payments) setPayments(res.payments);
      else setError(res.error || "โหลดข้อมูลไม่สำเร็จ");
      setIsLoading(false);
    })();
  }, []);

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const announcements = useMemo(() => {
    const map = new Map<string, string>();
    payments.forEach((p) => map.set(p.announcement.id, p.announcement.title));
    return Array.from(map, ([id, title]) => ({ id, title }));
  }, [payments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
      if (announcementFilter !== "ALL" && p.announcement.id !== announcementFilter) return false;
      if (!q) return true;
      const name = `${p.user.firstName} ${p.user.lastName}`.toLowerCase();
      return name.includes(q) || p.user.studentId.includes(q) || p.announcement.title.toLowerCase().includes(q);
    });
  }, [payments, search, statusFilter, announcementFilter]);

  const count = (s: string) => payments.filter((p) => p.status === s).length;
  const totalCollected = payments
    .filter((p) => p.status === "APPROVED")
    .reduce((sum, p) => sum + p.announcement.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Receipt className="w-7 h-7 text-blue-600" />
          ประวัติการชำระเงินทั้งหมด
        </h1>
        <p className="text-gray-500 mt-1 text-sm">ดูว่านักศึกษาแต่ละคนชำระรายการไหนไปแล้วบ้าง พร้อมเปิดดูสลิป</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5" /> ยอดเก็บได้แล้ว</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">฿{totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500">ชำระแล้ว</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{count("APPROVED")}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500">รอตรวจสอบ</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">{count("PENDING")}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500">สลิปไม่ผ่าน / ยังไม่ชำระ</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{count("REJECTED") + count("UNPAID")}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อ / รหัสนักศึกษา / ชื่อรายการ"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <select
            value={announcementFilter}
            onChange={(e) => setAnnouncementFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none md:w-64"
          >
            <option value="ALL">ทุกรายการเก็บเงิน</option>
            {announcements.map((a) => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                statusFilter === f.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {f.label}
              {f.key !== "ALL" && (
                <span className="ml-1.5 text-xs opacity-70">({count(f.key)})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 text-sm text-gray-500">
          แสดง {filtered.length} จาก {payments.length} รายการ
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-700">ไม่พบรายการ</p>
            <p className="text-sm text-gray-400 mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-medium text-gray-500 border-b border-gray-100">
                  <th className="p-4 pl-5">นักศึกษา</th>
                  <th className="p-4">รายการ</th>
                  <th className="p-4 text-right">จำนวนเงิน</th>
                  <th className="p-4 text-center">สถานะ</th>
                  <th className="p-4">อัปเดตล่าสุด</th>
                  <th className="p-4 text-center">สลิป</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => {
                  const fullName = `${p.user.firstName} ${p.user.lastName}`;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-5">
                        <p className="text-sm font-medium text-gray-900 whitespace-nowrap">{fullName}</p>
                        <p className="text-xs font-mono text-gray-500">{p.user.studentId}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-800">{p.announcement.title}</td>
                      <td className="p-4 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">
                        ฿{p.announcement.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-center">
                        <StatusBadge status={p.status} />
                        {p.status === "REJECTED" && p.rejectReason && (
                          <p className="text-[11px] text-red-500 mt-1 max-w-[160px] mx-auto break-words">
                            {p.rejectReason}
                          </p>
                        )}
                      </td>
                      <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                        {p.status === "UNPAID" ? "-" : formatDateTime(p.updatedAt)}
                      </td>
                      <td className="p-4 text-center">
                        {p.slipUrl ? (
                          <button
                            onClick={() => setPreview({ url: p.slipUrl, name: fullName, title: p.announcement.title })}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                          >
                            <ImageIcon className="w-3.5 h-3.5" /> ดูสลิป
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slip preview modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-4 border-b">
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900">สลิปการชำระเงิน</h3>
                <p className="text-xs text-gray-500 truncate">{preview.name} — {preview.title}</p>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.url}
                alt="สลิปการชำระเงิน"
                className="w-full rounded-xl object-contain max-h-[60vh] bg-gray-50"
              />
              <a
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-4 h-4" /> เปิดรูปขนาดเต็ม
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
