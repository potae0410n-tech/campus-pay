"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Users, MoreVertical, Loader2, ChevronRight } from "lucide-react";
import CreateRoomModal from "@/components/CreateRoomModal";
import { createRoom, getRooms } from "@/actions/room";
import { useRouter } from "next/navigation";

export default function AdminRoomsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    const res = await getRooms();
    if (res.success) {
      setRooms(res.rooms);
    }
    setIsLoading(false);
  };

  const handleCreateRoom = async (data: any) => {
    setIsCreating(true);
    const res = await createRoom(data);
    setIsCreating(false);
    
    if (res.success) {
      fetchRooms();
      alert(`สร้างห้อง "${data.roomName}" สำเร็จ!`);
    } else {
      alert(`เกิดข้อผิดพลาด: ${res.error}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการห้อง / กิจกรรม</h1>
          <p className="text-gray-500 mt-1">สร้างและติดตามห้องเรียกเก็บเงินสำหรับนักศึกษา</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          สร้างห้องใหม่
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="ค้นหาชื่อห้อง..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full font-medium">
            <Users className="w-4 h-4" />
            สิทธิ์เหรัญญิกเท่านั้น
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-sm font-medium text-gray-500">
                <th className="p-4 pl-6">ชื่อห้อง / กิจกรรม</th>
                <th className="p-4">จำนวนคนเข้าร่วม</th>
                <th className="p-4">สถานะ</th>
                <th className="p-4 text-right pr-6">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rooms.map((room) => (
                <tr 
                  key={room.id} 
                  onClick={() => router.push(`/admin/rooms/${room.id}`)}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                >
                  <td className="p-4 pl-6 font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{room.name}</td>
                  <td className="p-4 text-gray-600">
                    0 / {room.capacity} คน
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      เปิดใช้งาน
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="text-gray-400 group-hover:text-blue-600 p-1.5 rounded-lg group-hover:bg-blue-50 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {isLoading && (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          )}

          {!isLoading && rooms.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              ยังไม่มีห้องถูกสร้าง กด "สร้างห้องใหม่" เพื่อเริ่มต้น
            </div>
          )}
        </div>
      </div>

      <CreateRoomModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateRoom} 
      />
    </div>
  );
}
