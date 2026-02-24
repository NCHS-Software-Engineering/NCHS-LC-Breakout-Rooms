"use client";

import { SelectedRoom } from "@/types";

interface ReservationStatusProps {
  selectedRoom: SelectedRoom | null;
}

export default function ReservationStatus({ selectedRoom }: ReservationStatusProps) {
  const handleReserve = () => {
    if (selectedRoom) {
      alert(`ID: test-id, Room: ${selectedRoom.room}`);
    }
  };

  return (
    <div className="flex flex-col items-center bg-red-400 text-black rounded-xl w-50% p-6 shadow-lg mb-4">
      {selectedRoom ? (
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="text-lg font-semibold">You are logged in as: test-user</div>
          <button
            onClick={handleReserve}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition"
          >
            Reserve
          </button>
        </div>
      ) : (
        <div className="w-full text-center text-lg font-semibold text-gray-700">
          Select a room from below.
        </div>
      )}
    </div>
  );
}
