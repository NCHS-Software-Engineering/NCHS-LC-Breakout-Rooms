"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const scheduleByDay = useMemo(
    () => ({
      Monday: [
        { label: "Period 1", start: "7:45 AM", end: "8:35 AM" },
        { label: "Period 2", start: "8:41 AM", end: "9:34 AM" },
        { label: "Period 3", start: "9:40 AM", end: "10:30 AM" },
        { label: "Period 4", start: "10:36 AM", end: "11:26 AM" },
        { label: "Period 5", start: "11:32 AM", end: "12:22 PM" },
        { label: "Period 6", start: "12:28 PM", end: "1:18 PM" },
        { label: "Period 7", start: "1:24 PM", end: "2:14 PM" },
        { label: "Period 8", start: "2:20 PM", end: "3:10 PM" },
      ],
      Tuesday: [
        { label: "Period 1", start: "7:45 AM", end: "8:30 AM" },
        { label: "Period 2", start: "8:35 AM", end: "9:20 AM" },
        { label: "SOAR", start: "9:25 AM", end: "10:10 AM" },
        { label: "Period 3", start: "10:15 AM", end: "11:00 AM" },
        { label: "Period 4", start: "11:05 AM", end: "11:50 AM" },
        { label: "Period 5", start: "11:55 AM", end: "12:40 PM" },
        { label: "Period 6", start: "12:45 PM", end: "1:30 PM" },
        { label: "Period 7", start: "1:35 PM", end: "2:20 PM" },
        { label: "Period 8", start: "2:25 PM", end: "3:10 PM" },
      ],
      Wednesday: [
        { label: "Period 1", start: "9:00 AM", end: "9:42 AM" },
        { label: "Period 2", start: "9:47 AM", end: "10:29 AM" },
        { label: "Period 3", start: "10:34 AM", end: "11:16 AM" },
        { label: "Period 4", start: "11:21 AM", end: "12:03 PM" },
        { label: "Period 5", start: "12:08 PM", end: "12:49 PM" },
        { label: "Period 6", start: "12:54 PM", end: "1:36 PM" },
        { label: "Period 7", start: "1:41 PM", end: "2:23 PM" },
        { label: "Period 8", start: "2:28 PM", end: "3:10 PM" },
      ],
      Thursday: [
        { label: "Period 1", start: "7:45 AM", end: "8:30 AM" },
        { label: "Period 2", start: "8:35 AM", end: "9:20 AM" },
        { label: "SOAR", start: "9:25 AM", end: "10:10 AM" },
        { label: "Period 3", start: "10:15 AM", end: "11:00 AM" },
        { label: "Period 4", start: "11:05 AM", end: "11:50 AM" },
        { label: "Period 5", start: "11:55 AM", end: "12:40 PM" },
        { label: "Period 6", start: "12:45 PM", end: "1:30 PM" },
        { label: "Period 7", start: "1:35 PM", end: "2:20 PM" },
        { label: "Period 8", start: "2:25 PM", end: "3:10 PM" },
      ],
      Friday: [
        { label: "Period 1", start: "7:45 AM", end: "8:35 AM" },
        { label: "Period 2", start: "8:41 AM", end: "9:34 AM" },
        { label: "Period 3", start: "9:40 AM", end: "10:30 AM" },
        { label: "Period 4", start: "10:36 AM", end: "11:26 AM" },
        { label: "Period 5", start: "11:32 AM", end: "12:22 PM" },
        { label: "Period 6", start: "12:28 PM", end: "1:18 PM" },
        { label: "Period 7", start: "1:24 PM", end: "2:14 PM" },
        { label: "Period 8", start: "2:20 PM", end: "3:10 PM" },
      ],
    }),
    []
  );

  const checkoutReservations = useMemo(
    () => [
      { id: "c1", room: "Room 1", guestName: "John Doe", endTime: "10:30 AM", period: "Period 3" },
      { id: "c2", room: "Room 2", guestName: "Alice Williams", endTime: "11:00 AM", period: "Period 3" },
      { id: "c3", room: "Room 3", guestName: "Diana Prince", endTime: "11:26 AM", period: "Period 4" },
    ],
    []
  );

  const getMinutes = (timeString: string) => {
    const [time, meridiem] = timeString.split(" ");
    const [hourStr, minuteStr] = time.split(":");
    const baseHour = parseInt(hourStr, 10) % 12;
    const hour = meridiem === "PM" ? baseHour + 12 : baseHour;
    return hour * 60 + parseInt(minuteStr, 10);
  };

  const todayKey = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todaySchedule = scheduleByDay[todayKey as keyof typeof scheduleByDay] ?? [];
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const currentPeriod = todaySchedule.find(
    (period) => nowMinutes >= getMinutes(period.start) && nowMinutes <= getMinutes(period.end)
  );
  const checkoutRooms = checkoutReservations.filter(
    (reservation) => reservation.period === currentPeriod?.label
  );

  const handleLogout = () => {
    setIsLoading(true);
    // Clear any session data
    // localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-sm font-semibold text-gray-500">Current Period</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">
              {currentPeriod ? currentPeriod.label : "No active period"}
            </h2>
            <p className="text-gray-600 mt-2">
              {currentPeriod
                ? `${currentPeriod.start} - ${currentPeriod.end}`
                : "Outside scheduled periods"}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Rooms to Check Out</h2>
              <span className="text-sm text-gray-500">{todayKey}</span>
            </div>
            {checkoutRooms.length === 0 ? (
              <p className="text-gray-600 mt-4">No checkouts scheduled for this period.</p>
            ) : (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {checkoutRooms.map((room) => (
                  <div key={room.id} className="border border-red-100 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-500">{room.room}</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{room.guestName}</p>
                    <p className="text-sm text-red-600 mt-2">Checkout by {room.endTime}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome</h2>
            <p className="text-gray-600">
              You are now logged in as an administrator
            </p>
          </div>

          {/* Breakout Rooms Management */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Breakout Rooms</h2>
            <p className="text-gray-600 mb-4">
              Manage LC breakout room settings and reservations
            </p>
            <button
              onClick={() => router.push("/admin/manage-rooms")}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
            >
              Manage Rooms
            </button>
          </div>

          {/* Users Management */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Users</h2>
            <p className="text-gray-600 mb-4">
              View and manage user accounts
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer">
              Manage Users
            </button>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Reports</h2>
            <p className="text-gray-600 mb-4">
              View usage history and statistics
            </p>
            <button
              onClick={() => router.push("/admin/reports")}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
            >
              View Reports
            </button>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600 mb-4">
              Configure system settings
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer">
              Go to Settings
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
