"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createRoom(data: {
  roomName: string;
  description: string;
  amount: number;
  capacity: number;
  password: string;
  bankAccount: string;
  bankName: string;
}) {
  try {
    return { 
      success: true, 
      room: {
        id: "room-default",
        name: data.roomName,
        description: data.description,
        amount: data.amount,
        capacity: data.capacity,
        bankAccount: data.bankAccount,
        bankName: data.bankName,
      } 
    };
  } catch (error: any) {
    console.error("Error creating room:", error);
    return { success: false, error: error.message };
  }
}

export async function getRooms() {
  try {
    return { success: true, rooms: [] };
  } catch (error: any) {
    console.error("Error fetching rooms:", error);
    return { success: false, error: error.message, rooms: [] };
  }
}

export async function getRoomById(id: string) {
  try {
    return { 
      success: true, 
      room: {
        id,
        name: "ห้องกิจกรรมทั่วไป",
        description: "รายละเอียดกิจกรรม",
        amount: 500,
        capacity: 50,
        bankAccount: "123-4-56789-0",
        bankName: "ธนาคารกสิกรไทย",
        members: []
      } 
    };
  } catch (error: any) {
    console.error("Error fetching room:", error);
    return { success: false, error: error.message };
  }
}

export async function joinRoom(roomId: string, password: string) {
  try {
    return { success: true };
  } catch (error: any) {
    console.error("Error joining room:", error);
    return { success: false, error: error.message };
  }
}