"use client";

import { useState } from "react";
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

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for the 3 breakout rooms
  const [rooms] = useState<Room[]>([
    {
      id: "room1",
      name: "Room 1",
      currentOccupant: { id: "p1", name: "John Doe", email: "john.doe@email.com" },
    },
    {
      id: "room2",
      name: "Room 2",
      currentOccupant: { id: "p4", name: "Alice Williams", email: "alice.williams@email.com" },
    },
    {
      id: "room3",
      name: "Room 3",
      currentOccupant: null,
    },
  ]);
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
