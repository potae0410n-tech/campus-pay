"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ViewModeContextType {
  isAdminViewingAsStudent: boolean;
  toggleViewMode: () => void;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  currentStudentId: string;       // studentId ของผู้ล็อกอิน
  currentUserName: string;        // ชื่อ-นามสกุล
  setCurrentUser: (studentId: string, name: string) => void;
}

const ViewModeContext = createContext<ViewModeContextType>({
  isAdminViewingAsStudent: false,
  toggleViewMode: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
  currentStudentId: "",
  currentUserName: "",
  setCurrentUser: () => {},
});

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminViewingAsStudent, setIsAdminViewingAsStudent] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");

  // อ่านจาก localStorage เมื่อโหลด
  useEffect(() => {
    const storedAdmin = localStorage.getItem("campuspay_is_admin");
    const storedView = localStorage.getItem("campuspay_view_as_student");
    const storedStudentId = localStorage.getItem("campuspay_student_id");
    const storedName = localStorage.getItem("campuspay_user_name");
    if (storedAdmin === "true") setIsAdmin(true);
    if (storedView === "true") setIsAdminViewingAsStudent(true);
    if (storedStudentId) setCurrentStudentId(storedStudentId);
    if (storedName) setCurrentUserName(storedName);
  }, []);

  const setCurrentUser = (studentId: string, name: string) => {
    setCurrentStudentId(studentId);
    setCurrentUserName(name);
    localStorage.setItem("campuspay_student_id", studentId);
    localStorage.setItem("campuspay_user_name", name);
  };

  const setIsAdminPersist = (v: boolean) => {
    setIsAdmin(v);
    localStorage.setItem("campuspay_is_admin", String(v));
    if (!v) {
      setIsAdminViewingAsStudent(false);
      localStorage.setItem("campuspay_view_as_student", "false");
    }
  };

  const toggleViewMode = () => {
    const next = !isAdminViewingAsStudent;
    setIsAdminViewingAsStudent(next);
    localStorage.setItem("campuspay_view_as_student", String(next));
  };

  return (
    <ViewModeContext.Provider
      value={{
        isAdminViewingAsStudent,
        toggleViewMode,
        isAdmin,
        setIsAdmin: setIsAdminPersist,
        currentStudentId,
        currentUserName,
        setCurrentUser,
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  return useContext(ViewModeContext);
}
