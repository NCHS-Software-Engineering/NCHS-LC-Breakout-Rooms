"use client";

import { useState } from "react";
import { SelectedRoom } from "@/types";

interface ReservationStatusProps {
  selectedRoom: SelectedRoom | null;
  onReservationSuccess?: () => void;
}

export default function ReservationStatus({ selectedRoom, onReservationSuccess }: ReservationStatusProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const userID = "test-user"; // TODO: Replace with actual user ID from session/OAuth
  const currentDate = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format

  const handleReserve = async () => {
    if (!selectedRoom) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slotID: selectedRoom.slotID,
          userID: userID,
          roomID: selectedRoom.roomNumber,
          reservationDate: currentDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Successfully reserved ${selectedRoom.room} for ${selectedRoom.period} (${selectedRoom.time})!`,
        });
        
        // Call the callback to refresh room availability
        if (onReservationSuccess) {
          setTimeout(() => {
            onReservationSuccess();
          }, 500);
        }
        
        // Clear the message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to create reservation",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while creating your reservation",
      });
      console.error("Reservation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-red-400 text-black rounded-xl w-50% p-6 shadow-lg mb-4">
      {selectedRoom ? (
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="text-lg font-semibold">You are logged in as: {userID}</div>
          <button
            onClick={handleReserve}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? "Reserving..." : "Reserve"}
          </button>
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm font-semibold ${
                message.type === "success"
                  ? "bg-green-200 text-green-800 border border-green-500"
                  : "bg-red-200 text-red-800 border border-red-500"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full text-center text-lg font-semibold text-gray-700">
          Select a room from below.
        </div>
      )}
    </div>
  );
}
