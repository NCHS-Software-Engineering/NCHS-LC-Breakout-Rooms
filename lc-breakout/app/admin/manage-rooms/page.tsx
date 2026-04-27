"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import RoomCard from "../components/RoomCard";
import { useAdminGuard } from "../lib/useAdminGuard";
import { AdminRoom } from "../lib/types";

export default function ManageRooms() {
  const router = useRouter();
  const { isAuthorized, isCheckingAuth } = useAdminGuard();
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRooms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/rooms/current", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch room occupancy");
      }

      const data = await response.json();
      setRooms(Array.isArray(data.rooms) ? data.rooms : []);
    } catch (error) {
      console.error(error);
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      loadRooms();
    }
  }, [isAuthorized]);

  const handleRemovePerson = async (reservationId: string) => {
    try {
      const response = await fetch(
        `/api/admin/reservations?reservationId=${encodeURIComponent(reservationId)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        window.alert(errorData.error || "Failed to remove reservation");
        return;
      }

      await loadRooms();
    } catch (error) {
      console.error(error);
      window.alert("Failed to remove reservation");
    }
  };

  if (isCheckingAuth || !isAuthorized) {
    return (
      <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center">
        <p className="text-gray-700 font-semibold">Loading room management...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <PageHeader title="Manage Breakout Rooms" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-600 font-medium mb-6">
            Loading room occupancy...
          </div>
        ) : null}
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
