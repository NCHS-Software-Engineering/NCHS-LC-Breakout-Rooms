"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import PageHeader from "../components/PageHeader";
import FilterSection from "../components/FilterSection";
import EmptyState from "../components/EmptyState";

interface HistoryEntry {
  id: string;
  name: string;
  email: string;
  room: string;
  roomNumber: number;
  checkInTime: string;
  checkOutTime: string | null;
  date: string;
  duration: number; // in minutes
}

export default function Reports() {
  const router = useRouter();

  // Mock data for all-time room usage history
  const [historyData] = useState<HistoryEntry[]>([
    { id: "h1", name: "John Doe", email: "john.doe@email.com", room: "Room 1", roomNumber: 1, checkInTime: "10:30 AM", checkOutTime: "11:45 AM", date: "2024-02-10", duration: 75 },
    { id: "h2", name: "Jane Smith", email: "jane.smith@email.com", room: "Room 1", roomNumber: 1, checkInTime: "10:32 AM", checkOutTime: "12:00 PM", date: "2024-02-10", duration: 88 },
    { id: "h3", name: "Bob Johnson", email: "bob.johnson@email.com", room: "Room 2", roomNumber: 2, checkInTime: "10:35 AM", checkOutTime: "11:20 AM", date: "2024-02-10", duration: 45 },
    { id: "h4", name: "Alice Williams", email: "alice.williams@email.com", room: "Room 3", roomNumber: 3, checkInTime: "10:31 AM", checkOutTime: "11:50 AM", date: "2024-02-10", duration: 79 },
    { id: "h5", name: "Charlie Brown", email: "charlie.brown@email.com", room: "Room 2", roomNumber: 2, checkInTime: "10:33 AM", checkOutTime: "11:15 AM", date: "2024-02-10", duration: 42 },
    { id: "h6", name: "Diana Prince", email: "diana.prince@email.com", room: "Room 1", roomNumber: 1, checkInTime: "11:00 AM", checkOutTime: "12:30 PM", date: "2024-02-10", duration: 90 },
    { id: "h7", name: "Edward Norton", email: "edward.norton@email.com", room: "Room 3", roomNumber: 3, checkInTime: "10:30 AM", checkOutTime: "11:45 AM", date: "2024-02-10", duration: 75 },
    { id: "h8", name: "Fiona Green", email: "fiona.green@email.com", room: "Room 2", roomNumber: 2, checkInTime: "11:15 AM", checkOutTime: "12:45 PM", date: "2024-02-10", duration: 90 },
    { id: "h9", name: "George Miller", email: "george.miller@email.com", room: "Room 1", roomNumber: 1, checkInTime: "09:30 AM", checkOutTime: "10:15 AM", date: "2024-02-09", duration: 45 },
    { id: "h10", name: "Helen White", email: "helen.white@email.com", room: "Room 3", roomNumber: 3, checkInTime: "02:00 PM", checkOutTime: "03:30 PM", date: "2024-02-09", duration: 90 },
    { id: "h11", name: "John Doe", email: "john.doe@email.com", room: "Room 2", roomNumber: 2, checkInTime: "01:00 PM", checkOutTime: "02:00 PM", date: "2024-02-09", duration: 60 },
    { id: "h12", name: "Ivan Black", email: "ivan.black@email.com", room: "Room 1", roomNumber: 1, checkInTime: "03:00 PM", checkOutTime: "04:15 PM", date: "2024-02-08", duration: 75 },
  ]);

  const [searchName, setSearchName] = useState("");
  const [searchRoom, setSearchRoom] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "room">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and sort the data
  const filteredAndSortedData = useMemo(() => {
    let filtered = historyData.filter((entry) => {
      const nameMatch = entry.name.toLowerCase().includes(searchName.toLowerCase()) ||
                       entry.email.toLowerCase().includes(searchName.toLowerCase());
      const roomMatch = searchRoom === "" || entry.roomNumber.toString() === searchRoom;
      const dateMatch = searchDate === "" || entry.date === searchDate;

      return nameMatch && roomMatch && dateMatch;
    });

    filtered.sort((a, b) => {
      let compareValue = 0;

      if (sortBy === "name") {
        compareValue = a.name.localeCompare(b.name);
      } else if (sortBy === "room") {
        compareValue = a.roomNumber - b.roomNumber;
      } else if (sortBy === "date") {
        compareValue = new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      return sortOrder === "asc" ? compareValue : -compareValue;
    });

    return filtered;
  }, [historyData, searchName, searchRoom, searchDate, sortBy, sortOrder]);

  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <PageHeader title="Room Usage Reports" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <FilterSection
          searchName={searchName}
          searchRoom={searchRoom}
          searchDate={searchDate}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSearchNameChange={setSearchName}
          onSearchRoomChange={setSearchRoom}
          onSearchDateChange={setSearchDate}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onClearFilters={() => {
            setSearchName("");
            setSearchRoom("");
            setSearchDate("");
          }}
        />

        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
          <div className="px-6 py-4 bg-linear-to-r from-red-600 to-red-700">
            <h2 className="text-lg font-bold text-white">
              Usage History ({filteredAndSortedData.length} records)
            </h2>
          </div>

          <div className="overflow-x-auto">
            {filteredAndSortedData.length === 0 ? (
              <div className="p-8">
                <EmptyState message="No records found. Try adjusting your filters." />
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedData.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-3 text-sm text-gray-900 font-semibold">
                        {entry.name}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{entry.email}</td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                          {entry.room}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform">
            Download CSV
          </button>
          <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform">
            Print Report
          </button>
        </div>
      </div>
    </main>
  );
}
