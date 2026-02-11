"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    // Clear any session data
    // localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer">
              Manage Rooms
            </button>
          </div>

          {/* Users Management */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Users</h2>
            <p className="text-gray-600 mb-4">
              View and manage user accounts
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer">
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer">
              View Reports
            </button>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600 mb-4">
              Configure system settings
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer">
              Go to Settings
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
