"use client";

interface Person {
  reservationId: string;
  id: string;
  name: string;
  email: string;
  period?: string;
  startTime?: string;
  endTime?: string;
}

interface Room {
  id: string;
  name: string;
  currentOccupant?: Person | null;
}

interface RoomOccupancySectionProps {
  rooms: Room[];
}

export default function RoomOccupancySection({ rooms }: RoomOccupancySectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-3 hover:shadow-xl transition-shadow duration-200 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Current Room Occupancy</h2>
        <p className="text-gray-600 text-sm mt-1">Real-time status of all breakout rooms</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border-2 rounded-lg p-6 transition-all duration-200 hover:shadow-md"
            style={
              room.currentOccupant
                ? {
                    borderColor: "rgb(220, 38, 38)",
                    backgroundColor: "rgb(254, 242, 242)",
                  }
                : {
                    borderColor: "rgb(229, 231, 235)",
                    backgroundColor: "rgb(249, 250, 251)",
                  }
            }
          >
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold text-lg">
                {room.name.split(" ")[1]}
              </span>
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  room.currentOccupant
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {room.currentOccupant ? "Occupied" : "Empty"}
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-3">{room.name}</h3>

            {room.currentOccupant ? (
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
                    Current Occupant
                  </p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    {room.currentOccupant.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
                    Email
                  </p>
                  <p className="text-sm text-gray-700 mt-1 break-all">
                    {room.currentOccupant.email}
                  </p>
                </div>
                {room.currentOccupant.period && room.currentOccupant.startTime && room.currentOccupant.endTime ? (
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
                      Active Slot
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {room.currentOccupant.period} ({room.currentOccupant.startTime} - {room.currentOccupant.endTime})
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-gray-500 text-sm">No occupant</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
