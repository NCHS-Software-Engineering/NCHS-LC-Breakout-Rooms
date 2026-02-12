"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <nav className="bg-white shadow-md border-b border-red-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-red-600 hover:text-red-800 font-semibold transition duration-200"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Manage Breakout Rooms</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{room.name}</h2>
              </div>

              <div className="px-6 py-4">
                {room.people.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No reservation for this room</p>
                ) : (
                  <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{room.people[0].name}</p>
                      <p className="text-gray-600 text-sm">{room.people[0].email}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Check-in: {room.people[0].checkInTime}
                      </p>
                    </div>
                    <button
                      className="ml-2 px-3 py-1 text-red-600 hover:bg-red-100 rounded transition duration-200 text-sm"
                      onClick={() => {
                        setRooms((prevRooms) =>
                          prevRooms.map((prevRoom) =>
                            prevRoom.id === room.id
                              ? { ...prevRoom, people: [] }
                              : prevRoom
                          )
                        );
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Booking Calendar & Reservations</h3>
            <p className="text-gray-600 mt-1">
              Create reservations, view bookings, and manage upcoming reservations.
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/reservations")}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Open Booking Center
          </button>
        </div>
      </div>
    </main>
  );
}
