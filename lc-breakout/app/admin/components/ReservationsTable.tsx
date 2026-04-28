"use client";

interface Reservation {
  id: string;
  roomId: string;
  roomNumber: number;
  guestName: string;
  email: string;
  date: string;
  period: string;
  startTime: string;
  endTime: string;
  slotId: number;
}

interface ReservationsTableProps {
  selectedDate: string;
  reservations: Reservation[];
  onRemove: (id: string, name: string) => void;
  onEdit?: (reservation: Reservation) => void;
}

export default function ReservationsTable({
  selectedDate,
  reservations,
  onRemove,
  onEdit,
}: ReservationsTableProps) {
  const dayReservations = reservations.filter((res) => res.date === selectedDate);

  const formattedDate = selectedDate
    ? (() => {
        const [year, month, day] = selectedDate.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      })()
    : "";

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
      <div className="px-6 py-4 bg-linear-to-r from-red-600 to-red-700">
        <h3 className="text-lg font-bold text-white">
          {selectedDate ? `Reservations for ${formattedDate}` : "Select a date to view reservations"}
        </h3>
        {selectedDate && (
          <p className="text-white text-sm mt-1">
            {dayReservations.length} reservation{dayReservations.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {!selectedDate ? (
        <div className="p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-600 mx-auto mb-4"
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
          <p className="text-gray-600 text-lg font-semibold">Click a date on the calendar to view reservations</p>
        </div>
      ) : dayReservations.length === 0 ? (
        <div className="p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600 text-lg font-semibold">No reservations for this date</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Room</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Guest Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time Slot</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {dayReservations
                .sort((a, b) => a.roomNumber - b.roomNumber)
                .map((reservation, index) => (
                  <tr
                    key={reservation.id}
                    className={`border-b hover:bg-red-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold text-sm">
                        {reservation.roomNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{reservation.guestName}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{reservation.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {reservation.startTime} - {reservation.endTime}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        {onEdit ? (
                          <button
                            onClick={() => onEdit(reservation)}
                            className="px-3 py-1 text-blue-600 hover:bg-blue-100 rounded transition duration-200 text-sm font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                        ) : null}
                        <button
                          onClick={() =>
                            onRemove(reservation.id, reservation.guestName)
                          }
                          className="px-3 py-1 text-red-600 hover:bg-red-100 rounded transition duration-200 text-sm font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
