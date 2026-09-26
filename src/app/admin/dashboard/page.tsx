"use client";

import { Wallet, Users, Bell, TrendingUp, Loader2, Pencil, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminDashboardStats, updateGeneralFund } from "@/actions/announcement";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit states สำหรับยอดเงินกองกลาง
  const [editingGeneral, setEditingGeneral] = useState(false);
  const [generalInput, setGeneralInput] = useState("");
  const [savingGeneral, setSavingGeneral] = useState(false);

  // Edit states สำหรับเงินรุ่นที่เหลือ
  const [editingClass, setEditingClass] = useState(false);
  const [classInput, setClassInput] = useState("");
  const [savingClass, setSavingClass] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getAdminDashboardStats();
    if (res.success) {
      setStats(res);
      setGeneralInput(res.fund?.generalBalance?.toString() ?? "0");
      setClassInput(res.fund?.classFund?.toString() ?? "0");
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const saveGeneral = async () => {
    setSavingGeneral(true);
    await updateGeneralFund({ generalBalance: parseFloat(generalInput) || 0 });
    await fetchData();
    setEditingGeneral(false);
    setSavingGeneral(false);
  };

  const saveClass = async () => {
    setSavingClass(true);
    await updateGeneralFund({ classFund: parseFloat(classInput) || 0 });
    await fetchData();
    setEditingClass(false);
    setSavingClass(false);
  };

  const formatCurrency = (val: number) =>
    "฿" + val.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ภาพรวมการเงิน</h1>
        <p className="text-gray-500 mt-1 text-sm">สรุปข้อมูลการเงินและนักศึกษาในระบบ</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ยอดเงินกองกลาง — กรอกเอง */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">ยอดเงินกองกลางคงเหลือ</h3>
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          {editingGeneral ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={generalInput}
                onChange={e => setGeneralInput(e.target.value)}
                className="flex-1 border border-blue-300 rounded-lg px-2 py-1.5 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 w-0"
                autoFocus
              />
              <button onClick={saveGeneral} disabled={savingGeneral} className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {savingGeneral ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button onClick={() => setEditingGeneral(false)} className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.fund?.generalBalance ?? 0)}</p>
              <button onClick={() => setEditingGeneral(true)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="แก้ไข">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1">กรอกโดยเหรัญญิก</p>
        </div>

        {/* รายการเรียกเก็บเงินทั้งหมด */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">รายการเรียกเก็บเงินทั้งหมด</h3>
            <div className="w-9 h-9 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats?.announcementCount ?? 0} รายการ</p>
          <p className="text-xs text-gray-400 mt-1">ประกาศที่สร้างในระบบ</p>
        </div>

        {/* ยอดเงินที่เก็บได้ (APPROVED) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">ยอดเงินที่เก็บได้</h3>
            <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalCollected ?? 0)}</p>
          <p className="text-xs text-gray-400 mt-1">จากรายการที่อนุมัติแล้ว</p>
        </div>

        {/* จำนวนนักศึกษาในระบบ */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">จำนวนนักศึกษาในระบบ</h3>
            <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats?.studentCount ?? 0} คน</p>
          <p className="text-xs text-gray-400 mt-1">นักศึกษาที่ลงทะเบียนแล้ว</p>
        </div>
      </div>

      {/* เงินรุ่นที่เหลือ */}
      <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">เงินรุ่นที่เหลือ</h3>
            <p className="text-xs text-gray-500 mt-0.5">กรอกและแก้ไขได้โดยเหรัญญิก</p>
          </div>
          <div className="flex items-center gap-3">
            {editingClass ? (
              <>
                <input
                  type="number"
                  value={classInput}
                  onChange={e => setClassInput(e.target.value)}
                  className="border border-blue-300 rounded-lg px-3 py-2 text-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 w-44"
                  autoFocus
                />
                <button onClick={saveClass} disabled={savingClass} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-1.5">
                  {savingClass ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} บันทึก
                </button>
                <button onClick={() => setEditingClass(false)} className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm hover:bg-gray-200">
                  ยกเลิก
                </button>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats?.fund?.classFund ?? 0)}</p>
                <button onClick={() => setEditingClass(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200">
                  <Pencil className="w-3.5 h-3.5" /> แก้ไข
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* รายชื่อนักศึกษา */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-gray-900">รายชื่อนักศึกษา</h3>
          </div>
          <span className="text-sm text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
            {stats?.studentCount ?? 0} คน
          </span>
        </div>

        {!stats?.students || stats.students.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p>ยังไม่มีนักศึกษาลงทะเบียนในระบบ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-medium text-gray-500 border-b border-gray-100 bg-gray-50/30">
                  <th className="px-5 py-3">#</th>
                  <th className="px-4 py-3">รหัสนักศึกษา</th>
                  <th className="px-4 py-3">ชื่อ - นามสกุล</th>
                  <th className="px-4 py-3">วันที่ลงทะเบียน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.students.map((s: any, i: number) => {
                  const initials = `${s.firstName[0]}${s.lastName[0]}`;
                  const colors = ["bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-green-100 text-green-700", "bg-yellow-100 text-yellow-700", "bg-red-100 text-red-700"];
                  const colorClass = colors[i % colors.length];
                  return (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 text-sm text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-700">{s.studentId}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${colorClass}`}>
                            {initials}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{s.firstName} {s.lastName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(s.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
