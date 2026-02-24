"use client";

interface HistoryEntry {
  id: string;
  name: string;
  email: string;
  room: string;
  roomNumber: number;
  date: string;
  period: string;
  startTime: string;
  endTime: string;
}

interface UsageHistoryTableProps {
  selectedDate: string;
  historyData: HistoryEntry[];
}

export default function UsageHistoryTable({
  selectedDate,
  historyData,
}: UsageHistoryTableProps) {
  const dayHistory = historyData
    .filter((entry) => entry.date === selectedDate)
    .sort((a, b) => a.roomNumber - b.roomNumber);

  if (dayHistory.length === 0) {
    return (
      <div className="p-8 text-center">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-500 font-medium">No usage recorded for this date</p>
        <p className="text-gray-400 text-sm mt-1">Select another date to view usage history</p>
      </div>
    );
  }

  const totalUsers = dayHistory.length;
  const roomsUsed = new Set(dayHistory.map((e) => e.roomNumber)).size;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-semibold">Total Users</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{totalUsers}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-semibold">Rooms Used</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{roomsUsed}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Room
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                User Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Period
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Time Range
              </th>
            </tr>
          </thead>
          <tbody>
            {dayHistory.map((entry, index) => (
              <tr
                key={entry.id}
                className={`border-b transition-colors duration-200 hover:bg-red-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold text-sm">
                    {entry.roomNumber}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                  {entry.name}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">{entry.email}</td>
                <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                  {entry.period}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {entry.startTime} - {entry.endTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
