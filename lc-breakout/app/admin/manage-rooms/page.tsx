"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import RoomCard from "../components/RoomCard";

interface Person {
  id: string;
  name: string;
  email: string;
}

interface Room {
  id: string;
  name: string;
  currentReservationID?: number | null;
  currentOccupant?: Person | null;
}

interface RoomApiResponse {
  id: number;
  name: string;
  currentReservationID: number | null;
  currentOccupant: string | null;
  currentOccupantEmail: string | null;
}

export default function ManageRooms() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/rooms");
      if (!response.ok) {
        throw new Error("Failed to fetch room occupancy");
      }

      const data: RoomApiResponse[] = await response.json();
      const transformedRooms: Room[] = data.map((room) => ({
        id: `room${room.id}`,
        name: room.name,
        currentReservationID: room.currentReservationID ?? null,
        currentOccupant: room.currentOccupant
          ? {
              id: room.currentOccupant,
              name: room.currentOccupant,
              email: room.currentOccupantEmail ?? "user@nchs.local",
            }
          : null,
      }));

      setRooms(transformedRooms);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching rooms:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleRemovePerson = async (roomId: string, reservationID?: number | null) => {
    if (!reservationID) {
      return;
    }

    if (!window.confirm(`Remove the current reservation from ${roomId}?`)) {
      return;
    }

    try {
      const response = await fetch("/api/admin/reservations", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reservationID }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove reservation");
      }

      await fetchRooms();
      alert("Reservation removed successfully.");
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Failed to remove reservation"}`);
      console.error("Error removing reservation:", err);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <PageHeader title="Manage Breakout Rooms" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading && <p className="mb-6 text-gray-700">Loading room occupancy...</p>}
        {error && <p className="mb-6 text-red-600">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} onRemovePerson={handleRemovePerson} />
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Booking Calendar & Reservations</h3>
              <p className="text-gray-600 mt-1">
                Create reservations, view bookings, and manage upcoming reservations.
              </p>
            </div>
            <button
              onClick={() => router.push("/admin/reservations")}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer"
            >
              Open Booking Center
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
