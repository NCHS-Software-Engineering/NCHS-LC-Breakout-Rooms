"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import RoomCard from "../components/RoomCard";

interface Person {
  id: string;
  name: string;
  email: string;
  checkInTime: string;
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  people: Person[];
}

export default function ManageRooms() {
  const router = useRouter();

  // Mock data for the 3 breakout rooms
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "room1",
      name: "Room 1",
      capacity: 6,
      people: [
        { id: "p1", name: "John Doe", email: "john.doe@email.com", checkInTime: "10:30 AM" },
      ],
    },
    {
      id: "room2",
      name: "Room 2",
      capacity: 6,
      people: [
        { id: "p4", name: "Alice Williams", email: "alice.williams@email.com", checkInTime: "10:31 AM" },
      ],
    },
    {
      id: "room3",
      name: "Room 3",
      capacity: 6,
      people: [
        { id: "p6", name: "Diana Prince", email: "diana.prince@email.com", checkInTime: "10:28 AM" },
      ],
    },
  ]);

  const handleRemovePerson = (roomId: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((prevRoom) =>
        prevRoom.id === roomId ? { ...prevRoom, people: [] } : prevRoom
      )
    );
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <PageHeader title="Manage Breakout Rooms" />

      <div className="max-w-7xl mx-auto px-6 py-12">
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
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform"
            >
              Open Booking Center
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
