"use client";

import { useEffect, useMemo, useState } from "react";
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
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  );
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const selectedMonth = useMemo(
    () => `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`,
    [currentDate]
  );

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/reports?month=${selectedMonth}`);
        if (!response.ok) {
          throw new Error("Failed to fetch reports history");
        }

        const data = await response.json();
        setHistoryData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching reports history:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [selectedMonth]);

  const getHistoryForDate = (date: string) => {
    return historyData.filter((entry) => entry.date === date);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <PageHeader title="Room Usage Reports" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading && <p className="mb-6 text-gray-700">Loading usage history...</p>}
        {error && <p className="mb-6 text-red-600">{error}</p>}

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
