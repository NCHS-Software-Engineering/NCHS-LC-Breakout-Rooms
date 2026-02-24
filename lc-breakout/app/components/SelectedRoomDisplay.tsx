"use client";

import { SelectedRoom } from "@/types";

interface SelectedRoomDisplayProps {
  selectedRoom: SelectedRoom | null;
}

export default function SelectedRoomDisplay({ selectedRoom }: SelectedRoomDisplayProps) {
  if (!selectedRoom) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-blue-100 border-2 border-blue-500 rounded-lg text-black font-semibold text-lg w-full text-center">
      Selected: {selectedRoom.period} at {selectedRoom.time} - {selectedRoom.room}
    </div>
  );
}
