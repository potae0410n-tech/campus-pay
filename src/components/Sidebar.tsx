"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  FolderOpen,
  Clock,
  BookOpen,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { useViewMode } from "@/context/ViewModeContext";

interface SidebarProps {
  role: "admin" | "student";
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, isAdminViewingAsStudent, toggleViewMode } = useViewMode();

  const adminMenu = [
    { name: "ภาพรวม (Dashboard)", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "ประกาศเก็บเงิน", href: "/admin/announcements", icon: FolderOpen },
  ];

  const studentMenu = [
    { name: "ภาพรวม (Dashboard)", href: "/student/dashboard", icon: LayoutDashboard },
    { name: "ประวัติการชำระเงิน", href: "/student/history", icon: Clock },
  ];

  const menu = role === "admin" ? adminMenu : studentMenu;

  // ปุ่ม toggle: แสดงเฉพาะถ้า isAdmin === true
  const handleToggleView = () => {
    toggleViewMode();
    if (!isAdminViewingAsStudent) {
      // กำลังจะสลับไปดูเป็นนักศึกษา
      router.push("/student/dashboard");
    } else {
      // กลับไปหน้าแอดมิน
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 text-blue-600">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-gray-900">CampusPay</span>
        </Link>
        <p className="text-xs text-gray-500 mt-1 pl-9">
          {role === "admin" ? "พอร์ทัลเหรัญญิก" : isAdminViewingAsStudent ? "มุมมองนักศึกษา" : "พอร์ทัลนักศึกษา"}
        </p>
      </div>

      {/* Admin View-as-Student Banner */}
      {isAdmin && isAdminViewingAsStudent && role === "student" && (
        <div className="mx-3 mb-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-800">โหมดแอดมิน</p>
              <p className="text-xs text-amber-600">กำลังดูในมุมนักศึกษา</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-2">
        {menu.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
              {item.name}
            </Link>
          );
        })}

        {/* Toggle View Mode Button (Admin only) */}
        {isAdmin && (
          <button
            onClick={handleToggleView}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mt-4 font-medium text-sm ${
              isAdminViewingAsStudent
                ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                : "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
            }`}
          >
            {isAdminViewingAsStudent ? (
              <>
                <EyeOff className="w-5 h-5 text-amber-600" />
                <span>กลับสู่มุมมองแอดมิน</span>
              </>
            ) : (
              <>
                <Eye className="w-5 h-5 text-purple-600" />
                <span>ดูในมุมมองนักศึกษา</span>
              </>
            )}
          </button>
        )}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-400" />
          การตั้งค่า
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-gray-400" />
          ศูนย์ช่วยเหลือ
        </Link>
        <Link
          href="/"
          onClick={() => {
            localStorage.removeItem("campuspay_is_admin");
            localStorage.removeItem("campuspay_view_as_student");
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-2"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          ออกจากระบบ
        </Link>
      </div>
    </div>
  );
}
