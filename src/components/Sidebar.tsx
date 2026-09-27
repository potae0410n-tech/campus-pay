"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  Menu,
  X,
  Search,
} from "lucide-react";
import { useViewMode } from "@/context/ViewModeContext";

interface SidebarProps {
  role: "admin" | "student";
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, isAdminViewingAsStudent, toggleViewMode } = useViewMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ปิด sidebar เมื่อเปลี่ยนหน้า
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ป้องกัน scroll ด้านหลังเมื่อ sidebar เปิดบนมือถือ
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const adminMenu = [
    { name: "ภาพรวม", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "ประกาศเก็บเงิน", href: "/admin/announcements", icon: FolderOpen },
  ];

  const studentMenu = [
    { name: "ภาพรวม", href: "/student/dashboard", icon: LayoutDashboard },
    { name: "ค้นหากิจกรรม", href: "/student/join", icon: Search },
    { name: "ประวัติชำระเงิน", href: "/student/history", icon: Clock },
  ];

  const menu = role === "admin" ? adminMenu : studentMenu;

  const handleToggleView = () => {
    toggleViewMode();
    if (!isAdminViewingAsStudent) {
      router.push("/student/dashboard");
    } else {
      router.push("/admin/dashboard");
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-gray-900 block leading-tight">CampusPay</span>
            <span className="text-xs text-gray-400">
              {role === "admin" ? "พอร์ทัลเหรัญญิก" : isAdminViewingAsStudent ? "มุมมองนักศึกษา" : "พอร์ทัลนักศึกษา"}
            </span>
          </div>
        </Link>
      </div>

      {/* Admin View-as-Student Banner */}
      {isAdmin && isAdminViewingAsStudent && role === "student" && (
        <div className="mx-3 mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
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
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Toggle View Mode Button (Admin only) */}
        {isAdmin && (
          <button
            onClick={handleToggleView}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all mt-2 text-sm font-medium ${
              isAdminViewingAsStudent
                ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                : "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
            }`}
          >
            {isAdminViewingAsStudent ? (
              <>
                <EyeOff className="w-5 h-5 text-amber-600 shrink-0" />
                <span>กลับสู่มุมมองแอดมิน</span>
              </>
            ) : (
              <>
                <Eye className="w-5 h-5 text-purple-600 shrink-0" />
                <span>ดูในมุมมองนักศึกษา</span>
              </>
            )}
          </button>
        )}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-1">
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-4 h-4 text-gray-400 shrink-0" />
          การตั้งค่า
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-gray-400 shrink-0" />
          ช่วยเหลือ
        </Link>
        <Link
          href="/"
          onClick={() => {
            localStorage.removeItem("campuspay_is_admin");
            localStorage.removeItem("campuspay_view_as_student");
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-500 shrink-0" />
          ออกจากระบบ
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* ===== MOBILE TOPBAR ===== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900">CampusPay</span>
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="เปิดเมนู"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* ===== MOBILE OVERLAY BACKDROP ===== */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ===== MOBILE DRAWER ===== */}
      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="ปิดเมนู"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <SidebarContent />
      </div>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <div className="hidden md:flex md:flex-col md:w-60 bg-white border-r border-gray-100 h-screen shrink-0">
        <SidebarContent />
      </div>
    </>
  );
}
