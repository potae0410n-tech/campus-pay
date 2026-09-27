"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, CheckCircle, ArrowRight, Eye, EyeOff, ShieldCheck, GraduationCap, Lock } from "lucide-react";
import { loginUser, registerUser } from "@/actions/auth";
import { useViewMode } from "@/context/ViewModeContext";

export default function LoginPage() {
  const router = useRouter();
  const { setIsAdmin, setCurrentUser } = useViewMode();
  const [isLogin, setIsLogin] = useState(true);

  // ---- Login states ----
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // ---- Register states ----
  const [regRole, setRegRole] = useState<"STUDENT" | "ADMIN">("STUDENT");
  const [regUsername, setRegUsername] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regStudentId, setRegStudentId] = useState("");
  const [regConfirmStudentId, setRegConfirmStudentId] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regAdminCode, setRegAdminCode] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [regError, setRegError] = useState("");
  const [isRegLoading, setIsRegLoading] = useState(false);

  // ---- Login submit ----
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoginLoading(true);

    const res = await loginUser(loginId.trim(), loginPassword);
    setIsLoginLoading(false);

    if (!res.success) {
      setLoginError(res.error || "เกิดข้อผิดพลาด");
      return;
    }

    // บันทึก role และข้อมูล user ลง context
    const isAdminRole = res.role === "ADMIN";
    setIsAdmin(isAdminRole);
    if (res.user) {
      setCurrentUser(
        res.user.studentId,
        `${res.user.firstName} ${res.user.lastName}`
      );
    }

    if (isAdminRole) {
      router.push("/admin/dashboard");
    } else {
      router.push("/student/dashboard");
    }
  };

  // ---- Register submit ----
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (regStudentId.length !== 12) {
      setRegError("รหัสนักศึกษาต้องมี 12 หลัก");
      return;
    }
    if (regStudentId !== regConfirmStudentId) {
      setRegError("รหัสนักศึกษาไม่ตรงกัน");
      return;
    }
    if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/.test(regPassword)) {
      setRegError("รหัสผ่านต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้น ห้ามใช้ภาษาไทย");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setIsRegLoading(true);
    const res = await registerUser({
      username: regUsername.trim(),
      firstName: regFirstName.trim(),
      lastName: regLastName.trim(),
      studentId: regStudentId.trim(),
      password: regPassword,
      role: regRole,
      adminCode: regAdminCode,
    });
    setIsRegLoading(false);

    if (!res.success) {
      setRegError(res.error || "เกิดข้อผิดพลาด");
      return;
    }

    // สำเร็จ → switch to login
    setIsLogin(true);
    setRegError("");
    alert(`สร้างบัญชี${regRole === "ADMIN" ? "แอดมิน" : "นักศึกษา"}สำเร็จ! กรุณาเข้าสู่ระบบ`);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setLoginError("");
    setRegError("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">CampusPay</h1>
              <p className="text-xs text-blue-200">การเงินนักศึกษา</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm mb-6 backdrop-blur-sm border border-white/20">
            <span className="text-blue-200"> สร้างเพื่อชุมชนมหาวิทยาลัย</span>
          </div>

          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            จัดการการเงินใน<br />มหาวิทยาลัย<br />
            <span className="text-teal-300">ให้ง่ายขึ้น</span>
          </h2>

          <p className="text-lg text-blue-100 max-w-md">
            ช่องทางที่ชาญฉลาดสำหรับจัดการการชำระเงิน และกิจกรรมนักศึกษาในที่เดียว
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-blue-200">
          <CheckCircle className="w-4 h-4" />
          <span>ปลอดภัย โปร่งใส และออกแบบมาเพื่อนักศึกษา</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

          <div className="mb-6">
            <h3 className="text-sm font-medium text-blue-600 mb-1">
              {isLogin ? "ยินดีต้อนรับกลับมา" : "เริ่มต้นใช้งาน"}
            </h3>
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? "เข้าสู่บัญชีของคุณ" : "สร้างบัญชีใหม่"}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {isLogin ? "เข้าสู่ระบบการเงินมหาวิทยาลัยของคุณด้านล่าง" : "กรอกข้อมูลเพื่อลงทะเบียนเข้าสู่ระบบ"}
            </p>
          </div>

          {/* ============ LOGIN FORM ============ */}
          {isLogin && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รหัสนักศึกษา / ไอดีผู้ใช้
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                  placeholder="เช่น 650000000000 หรือ somchai_123"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
                  <a href="#" className="text-xs text-blue-600 hover:underline">ลืมรหัสผ่าน?</a>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPw ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPw(!showLoginPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showLoginPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 mt-2"
              >
                {isLoginLoading ? "กำลังเข้าสู่ระบบ..." : <>เข้าสู่ระบบ <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {/* ============ REGISTER FORM ============ */}
          {!isLogin && (
            <form onSubmit={handleRegister} className="space-y-4">

              {/* Role Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทบัญชี</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegRole("STUDENT")}
                    className={`flex items-center gap-2 justify-center px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                      regRole === "STUDENT"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                    นักศึกษา
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole("ADMIN")}
                    className={`flex items-center gap-2 justify-center px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                      regRole === "ADMIN"
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    แอดมิน
                  </button>
                </div>
              </div>

              {/* Admin Secret Code (only for ADMIN) */}
              {regRole === "ADMIN" && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <label className="text-sm font-semibold text-purple-800">รหัสยืนยันแอดมิน</label>
                  </div>
                  <p className="text-xs text-purple-600 mb-3">กรอกรหัสที่ได้รับจากผู้ดูแลระบบเพื่อสร้างบัญชีแอดมิน</p>
                  <div className="relative">
                    <input
                      type={showAdminCode ? "text" : "password"}
                      required={regRole === "ADMIN"}
                      className="w-full px-4 py-2.5 pr-12 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors bg-white"
                      placeholder="รหัสยืนยันแอดมิน"
                      value={regAdminCode}
                      onChange={(e) => setRegAdminCode(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminCode(!showAdminCode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
                    >
                      {showAdminCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้ (Username)</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="เช่น somchai_123"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                />
              </div>

              {/* First + Last name */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อจริง</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="สมชาย"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="ใจดี"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {regRole === "ADMIN" ? "รหัสประจำตัว (12 หลัก)" : "รหัสนักศึกษา (12 หลัก)"}
                </label>
                <input
                  type="text"
                  required
                  maxLength={12}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="เช่น 256700000123"
                  value={regStudentId}
                  onChange={(e) => setRegStudentId(e.target.value.replace(/\D/g, ""))}
                />
                <p className="text-xs text-gray-400 mt-1">{regStudentId.length}/12 หลัก</p>
              </div>

              {/* Confirm Student ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสนักศึกษาอีกครั้ง</label>
                <input
                  type="text"
                  required
                  maxLength={12}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    regConfirmStudentId && regConfirmStudentId !== regStudentId
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="กรอกรหัสอีกครั้ง"
                  value={regConfirmStudentId}
                  onChange={(e) => setRegConfirmStudentId(e.target.value.replace(/\D/g, ""))}
                />
                {regConfirmStudentId && regConfirmStudentId !== regStudentId && (
                  <p className="text-xs text-red-500 mt-1">รหัสไม่ตรงกัน</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
                <div className="relative">
                  <input
                    type={showRegPw ? "text" : "password"}
                    required
                    className={`w-full px-4 py-2.5 pr-12 rounded-lg border text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      regPassword && /[\u0E00-\u0E7F]/.test(regPassword)
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="ภาษาอังกฤษหรือตัวเลขเท่านั้น เช่น Pass1234"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPw(!showRegPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showRegPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {regPassword && /[\u0E00-\u0E7F]/.test(regPassword) && (
                  <p className="text-xs text-red-500 mt-1">⚠️ รหัสผ่านต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้น</p>
                )}
                <p className="text-xs text-gray-400 mt-1">ใช้ตัวอักษรภาษาอังกฤษ (A-Z, a-z), ตัวเลข (0-9) หรือสัญลักษณ์เท่านั้น</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่านอีกครั้ง</label>
                <input
                  type="password"
                  required
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    regConfirmPassword && regConfirmPassword !== regPassword
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                />
                {regConfirmPassword && regConfirmPassword !== regPassword && (
                  <p className="text-xs text-red-500 mt-1">รหัสผ่านไม่ตรงกัน</p>
                )}
              </div>

              {regError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {regError}
                </div>
              )}

              <button
                type="submit"
                disabled={isRegLoading}
                className={`w-full font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 mt-2 text-white ${
                  regRole === "ADMIN"
                    ? "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400"
                    : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                }`}
              >
                {isRegLoading ? "กำลังสร้างบัญชี..." : <>สร้างบัญชี <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {/* Toggle */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "ยังไม่มีบัญชีใช่ไหม?" : "มีบัญชีอยู่แล้วใช่ไหม?"}{" "}
              <button
                onClick={switchMode}
                className="text-blue-600 font-semibold hover:underline"
              >
                {isLogin ? "สร้างบัญชีใหม่" : "เข้าสู่ระบบเลย"}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
