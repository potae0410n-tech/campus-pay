import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar role="admin" />
      <main className="flex-1 overflow-y-auto">
        {/* Mobile top padding เพื่อไม่ให้ content ซ่อนอยู่ใต้ topbar */}
        <div className="pt-14 md:pt-0">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
