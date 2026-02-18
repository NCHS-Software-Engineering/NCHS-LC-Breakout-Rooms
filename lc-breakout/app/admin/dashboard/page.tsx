"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StatCard from "../components/StatCard";
import DashboardCard from "../components/DashboardCard";
import CheckoutCard from "../components/CheckoutCard";

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
    <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <nav className="bg-white shadow-md border-b border-red-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Current Period"
            value={currentPeriod ? currentPeriod.label : "No active period"}
            subtitle={
              currentPeriod
                ? `${currentPeriod.start} - ${currentPeriod.end}`
                : "Outside scheduled periods"
            }
            variant={currentPeriod ? "highlight" : "default"}
          />

          <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Rooms to Check Out</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {todayKey}
              </span>
            </div>
            {checkoutRooms.length === 0 ? (
              <div className="text-center py-6">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-600">No checkouts scheduled for this period.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {checkoutRooms.map((room) => (
                  <CheckoutCard
                    key={room.id}
                    room={room.room}
                    guestName={room.guestName}
                    endTime={room.endTime}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="Welcome" description="You are now logged in as an administrator" />

          <DashboardCard
            title="Breakout Rooms"
            description="Manage LC breakout room settings and reservations"
            action={{
              label: "Manage Rooms",
              onClick: () => router.push("/admin/manage-rooms"),
            }}
          />

          <DashboardCard
            title="Users"
            description="View and manage user accounts"
            action={{
              label: "Manage Users",
              onClick: () => router.push("/admin/users"),
            }}
          />

          <DashboardCard
            title="Reservations"
            description="Create and manage room reservations"
            action={{
              label: "View Reservations",
              onClick: () => router.push("/admin/reservations"),
            }}
          />

          <DashboardCard
            title="Reports"
            description="View usage history and statistics"
            action={{
              label: "View Reports",
              onClick: () => router.push("/admin/reports"),
            }}
          />

          <DashboardCard
            title="Settings"
            description="Configure system settings"
            action={{
              label: "Go to Settings",
              onClick: () => alert("Settings page coming soon!"),
            }}
          />
        </div>
      </div>
    </main>
  );
}
