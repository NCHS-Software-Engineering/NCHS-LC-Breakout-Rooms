"use client";

import { signOut } from "next-auth/react";

interface DashboardHeaderProps {
  isLoading?: boolean;
}

export default function DashboardHeader({ isLoading = false }: DashboardHeaderProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <nav className="bg-white shadow-md border-b border-red-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </nav>
  );
}
