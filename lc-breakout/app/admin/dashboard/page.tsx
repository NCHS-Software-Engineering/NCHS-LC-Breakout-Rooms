"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import RoomOccupancySection from "../components/RoomOccupancySection";
import DashboardGrid from "../components/DashboardGrid";

interface Person {
  id: string;
  name: string;
  email: string;
}

interface Room {
  id: string;
  name: string;
  currentOccupant?: Person | null;
}

interface RoomApiResponse {
  id: number;
  name: string;
  currentOccupant: string | null;
  currentOccupantEmail: string | null;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch room occupancy from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/rooms");
        if (!response.ok) {
          throw new Error("Failed to fetch room occupancy");
        }
        const data: RoomApiResponse[] = await response.json();
        
        // Transform API data to match the Room interface
        const transformedRooms: Room[] = data.map((room) => ({
          id: `room${room.id}`,
          name: room.name,
          currentOccupant: room.currentOccupant 
            ? { 
                id: room.currentOccupant, 
                name: room.currentOccupant, 
                email: room.currentOccupantEmail ?? "user@nchs.local" 
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

    fetchRooms();
  }, []);
  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <DashboardHeader isLoading={isLoading} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && <p className="mb-6 text-red-600">{error}</p>}

        <RoomOccupancySection rooms={rooms} />

        <DashboardGrid />
      </div>
    </main>
  );
}
