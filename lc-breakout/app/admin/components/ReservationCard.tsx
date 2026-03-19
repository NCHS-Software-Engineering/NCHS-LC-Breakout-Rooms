interface ReservationCardProps {
  reservation: {
    id: string;
    roomNumber: number;
    guestName: string;
    email: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  onRemove: (id: string, name: string) => void;
}

export default function ReservationCard({
  reservation,
  onRemove,
}: ReservationCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 hover:shadow-xl transition-shadow duration-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold text-sm">
              {reservation.roomNumber}
            </span>
            <h3 className="text-lg font-bold text-gray-900">
              {reservation.guestName}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-1">{reservation.email}</p>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="inline-flex items-center gap-1 text-sm text-gray-700">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(reservation.date)}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-gray-700">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {reservation.startTime} - {reservation.endTime}
            </span>
          </div>
        </div>

        <button
          onClick={() => onRemove(reservation.id, reservation.guestName)}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
