interface Person {
  id: string;
  name: string;
  email: string;
}

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    currentOccupant?: Person | null;
  };
  onRemovePerson: (roomId: string) => void;
}

export default function RoomCard({ room, onRemovePerson }: RoomCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
      <div className="bg-linear-to-r from-red-600 to-red-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">{room.name}</h2>
      </div>

      <div className="px-6 py-4">
        {!room.currentOccupant ? (
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
            <p className="text-gray-500">No reservation for this room</p>
          </div>
        ) : (
          <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{room.currentOccupant.name}</p>
              <p className="text-gray-600 text-sm mt-1">{room.currentOccupant.email}</p>
            </div>
            <button
              className="ml-3 px-3 py-1 text-red-600 hover:bg-red-100 rounded transition duration-200 text-sm font-medium cursor-pointer"
              onClick={() => onRemovePerson(room.id)}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
