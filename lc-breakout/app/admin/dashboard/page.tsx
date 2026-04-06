"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import RoomOccupancySection from "../components/RoomOccupancySection";
import DashboardGrid from "../components/DashboardGrid";
import { useAdminGuard } from "../lib/useAdminGuard";
import { AdminRoom } from "../lib/types";

export default function AdminDashboard() {
  const { isAuthorized, isCheckingAuth } = useAdminGuard();
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthorized) {
      return;
    }

    const loadRooms = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/rooms/current", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load rooms");
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

    loadRooms();
  }, [isAuthorized]);

  if (isCheckingAuth || !isAuthorized) {
    return (
      <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center">
        <p className="text-gray-700 font-semibold">Loading admin dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <DashboardHeader isLoading={isLoading} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <RoomOccupancySection rooms={rooms} />

        <DashboardGrid />
      </div>
    </main>
  );
}
