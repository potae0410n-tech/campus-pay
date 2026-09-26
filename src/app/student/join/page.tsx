"use client";

import { useState, useEffect } from "react";
import { Search, Lock, X, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { getRooms, joinRoom } from "@/actions/room";

export default function JoinRoomPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      const res = await getRooms();
      if (res.success && res.rooms) {
        setAvailableRooms(res.rooms);
      }
      setIsLoading(false);
    };
    
    fetchRooms();
  }, []);

  const filteredRooms = availableRooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsJoining(true);
    
    const res = await joinRoom(selectedRoom.id, password);
    
    if (res.success) {
      alert("เข้าร่วมห้องสำเร็จ!");
      setSelectedRoom(null);
      setPassword("");
      router.push(`/student/dashboard`);
    } else {
      alert(res.error || "เกิดข้อผิดพลาด");
    }
    
    setIsJoining(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-10 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">ค้นหาและเข้าร่วมกิจกรรม</h1>
        <p className="text-gray-500">พิมพ์ชื่อห้องที่คุณต้องการชำระเงิน หรือรับลิงก์เชิญชวนจากเหรัญญิกเพื่อเข้าร่วมโดยตรง</p>
        
        <div className="relative mt-8">
          <Search className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="ค้นหาชื่อห้องกิจกรรม..."
            className="w-full pl-14 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div key={room.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{room.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{room.description || "ไม่มีรายละเอียดเพิ่มเติม"}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                  {room._count?.payments || 0} / {room.capacity} คน
                </span>
                <button 
                  onClick={() => setSelectedRoom(room)}
                  className="text-sm text-blue-600 font-medium group-hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" /> เข้าร่วม
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500">
            ไม่พบห้องที่ค้นหา
          </div>
        )}
      </div>

      {/* Password Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">กรอกรหัสผ่านเพื่อเข้าห้อง</h2>
              <button 
                onClick={() => {
                  setSelectedRoom(null);
                  setPassword("");
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleJoin} className="p-5">
              <p className="text-sm text-gray-600 mb-4">
                คุณกำลังจะเข้าร่วมห้อง <span className="font-bold text-gray-900">{selectedRoom.name}</span>
              </p>
              
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-4 pr-12 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-widest text-lg"
                  placeholder="••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isJoining}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors flex justify-center items-center gap-2 disabled:bg-blue-400"
              >
                {isJoining ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> กำลังเข้าร่วม...</>
                ) : (
                  "ยืนยันการเข้าร่วม"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
