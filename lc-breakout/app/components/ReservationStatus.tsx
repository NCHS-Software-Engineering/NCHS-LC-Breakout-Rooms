"use client";

import { useSession } from "next-auth/react";
import { SelectedRoom } from "@/types";

interface ReservationStatusProps {
  selectedRoom: SelectedRoom | null;
}

export default function ReservationStatus({ selectedRoom }: ReservationStatusProps) {

  const { data: session } = useSession();

  const handleReserve = async () => {
  if (!selectedRoom) return;

  if (!session) {
    alert("You must be logged in.");
    return;
  }

  console.log("RESERVE DATA", {
    roomId: selectedRoom?.roomNumber,
    slotId: selectedRoom?.slotID,
    date: selectedRoom?.date,
  });

  try {
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: selectedRoom.roomNumber,
        slotId: selectedRoom.slotID,
        date: selectedRoom.date,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to reserve");
      return;
    }

    alert("Reservation successful! \nUser: " + session.user.email + "\nSlotID: " + selectedRoom.slotID + "\nDate: " + selectedRoom.date);

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};

  

  return (
    <div className="mb-4 flex w-full max-w-2xl flex-col items-center rounded-xl bg-red-400 p-4 text-black shadow-lg sm:p-6">
      {selectedRoom ? (
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="text-center text-base font-semibold sm:text-lg">You are logged in as: {session?.user?.name || "not logged in"}</div>
          <button
            onClick={handleReserve}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition"
          >
            Reserve
          </button>
        </div>
      ) : (
        <div className="w-full text-center text-base font-semibold text-black sm:text-lg">
          Select a room from below.
        </div>
      )}
    </div>
  );
}
