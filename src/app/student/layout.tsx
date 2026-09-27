"use client";

import Sidebar from "@/components/Sidebar";
import { useViewMode } from "@/context/ViewModeContext";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isAdminViewingAsStudent, toggleViewMode } = useViewMode();
  const router = useRouter();

  const handleBackToAdmin = () => {
    toggleViewMode();
    router.push("/admin/dashboard");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar role={isAdmin && isAdminViewingAsStudent ? "student" : "student"} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin viewing-as-student top banner */}
        {isAdmin && isAdminViewingAsStudent && (
          <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-xs font-semibold">โหมดดูในฐานะนักศึกษา</span>
            </div>
            <button
              onClick={handleBackToAdmin}
              className="flex items-center gap-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              กลับแอดมิน
            </button>
          </div>
        )}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile top padding เพื่อไม่ให้ content ซ่อนอยู่ใต้ topbar */}
          <div className="pt-14 md:pt-0">
            <div className="p-4 md:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
