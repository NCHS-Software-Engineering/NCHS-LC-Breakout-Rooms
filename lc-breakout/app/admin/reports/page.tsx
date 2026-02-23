"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import UsageHistoryTable from "../components/UsageHistoryTable";

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

export default function Reports() {
  const router = useRouter();

  // Mock data for all-time room usage history
  const [historyData] = useState<HistoryEntry[]>([
    { id: "h1", name: "John Doe", email: "john.doe@email.com", room: "Room 1", roomNumber: 1, date: "2026-02-23", period: "Period 2", startTime: "8:41 AM", endTime: "9:34 AM" },
    { id: "h2", name: "Jane Smith", email: "jane.smith@email.com", room: "Room 1", roomNumber: 1, date: "2026-02-23", period: "Period 4", startTime: "10:36 AM", endTime: "11:26 AM" },
    { id: "h3", name: "Bob Johnson", email: "bob.johnson@email.com", room: "Room 2", roomNumber: 2, date: "2026-02-23", period: "Period 3", startTime: "9:40 AM", endTime: "10:30 AM" },
    { id: "h4", name: "Alice Williams", email: "alice.williams@email.com", room: "Room 3", roomNumber: 3, date: "2026-02-23", period: "Period 5", startTime: "11:32 AM", endTime: "12:22 PM" },
    { id: "h5", name: "Charlie Brown", email: "charlie.brown@email.com", room: "Room 2", roomNumber: 2, date: "2026-02-23", period: "Period 6", startTime: "12:28 PM", endTime: "1:18 PM" },
    { id: "h6", name: "Diana Prince", email: "diana.prince@email.com", room: "Room 1", roomNumber: 1, date: "2026-02-23", period: "Period 7", startTime: "1:24 PM", endTime: "2:14 PM" },
    { id: "h7", name: "Edward Norton", email: "edward.norton@email.com", room: "Room 3", roomNumber: 3, date: "2026-02-23", period: "Period 8", startTime: "2:20 PM", endTime: "3:10 PM" },
    { id: "h8", name: "Fiona Green", email: "fiona.green@email.com", room: "Room 2", roomNumber: 2, date: "2026-02-23", period: "Period 1", startTime: "7:45 AM", endTime: "8:35 AM" },
    { id: "h9", name: "George Miller", email: "george.miller@email.com", room: "Room 1", roomNumber: 1, date: "2026-02-22", period: "Period 3", startTime: "9:40 AM", endTime: "10:30 AM" },
    { id: "h10", name: "Helen White", email: "helen.white@email.com", room: "Room 3", roomNumber: 3, date: "2026-02-22", period: "Period 5", startTime: "11:32 AM", endTime: "12:22 PM" },
    { id: "h11", name: "John Doe", email: "john.doe@email.com", room: "Room 2", roomNumber: 2, date: "2026-02-22", period: "Period 2", startTime: "8:41 AM", endTime: "9:34 AM" },
    { id: "h12", name: "Ivan Black", email: "ivan.black@email.com", room: "Room 1", roomNumber: 1, date: "2026-02-21", period: "Period 4", startTime: "10:36 AM", endTime: "11:26 AM" },
    { id: "h13", name: "Julia Roberts", email: "julia.roberts@email.com", room: "Room 2", roomNumber: 2, date: "2026-02-21", period: "Period 6", startTime: "12:28 PM", endTime: "1:18 PM" },
    { id: "h14", name: "Kevin Hart", email: "kevin.hart@email.com", room: "Room 3", roomNumber: 3, date: "2026-02-21", period: "Period 7", startTime: "1:24 PM", endTime: "2:14 PM" },
    { id: "h15", name: "Lisa Wong", email: "lisa.wong@email.com", room: "Room 1", roomNumber: 1, date: "2026-02-20", period: "Period 1", startTime: "7:45 AM", endTime: "8:35 AM" },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 23));
  const [selectedDate, setSelectedDate] = useState("2026-02-23");

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatDateForCalendar = (day: number) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getHistoryForDate = (date: string) => {
    return historyData.filter((entry) => entry.date === date);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <PageHeader title="Room Usage Reports" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
          <div className="px-6 py-4 bg-linear-to-r from-red-600 to-red-700">
            <h3 className="text-lg font-bold text-white">Browse Usage by Date</h3>
          </div>

          <div className="p-6">
            <div className="bg-linear-to-br from-gray-50 to-white rounded-lg p-6 shadow-inner">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={previousMonth}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer"
                >
                  ← Previous
                </button>
                <h4 className="text-xl font-bold text-gray-900">
                  {currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h4>
                <button
                  onClick={nextMonth}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer"
                >
                  Next →
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="text-center font-bold text-gray-700 py-2 bg-gray-100 rounded"
                  >
                    {day}
                  </div>
                ))}
                {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square"></div>
                ))}
                {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = formatDateForCalendar(day);
                  const dayHistory = getHistoryForDate(dateStr);
                  const hasHistory = dayHistory.length > 0;
                  const isSelected = selectedDate === dateStr;

                  return (
                    <div
                      key={day}
                      className={`aspect-square p-2 rounded-lg border-2 text-center flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isSelected
                          ? "bg-red-600 border-red-700 text-white"
                          : hasHistory
                          ? "bg-red-100 border-red-500 hover:bg-red-200"
                          : "bg-white border-gray-200 hover:border-red-400"
                      }`}
                      onClick={() => setSelectedDate(dateStr)}
                    >
                      <span
                        className={`font-semibold text-sm ${
                          isSelected ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {day}
                      </span>
                      {hasHistory && !isSelected && (
                        <span className="text-xs font-bold text-red-700 bg-red-200 rounded px-1">
                          {dayHistory.length} use
                          {dayHistory.length > 1 ? "s" : ""}
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-xs font-bold text-red-100">
                          {dayHistory.length} use
                          {dayHistory.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {selectedDate && (
          <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
            <div className="px-6 py-4 bg-linear-to-r from-red-600 to-red-700">
              <h3 className="text-lg font-bold text-white">
                Usage History for {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
            </div>
            <div className="p-6">
              <UsageHistoryTable selectedDate={selectedDate} historyData={historyData} />
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4">
          <button className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer">
            Download CSV
          </button>
          <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer">
            Print Report
          </button>
        </div>
      </div>
    </main>
  );
}
