"use client";

import { useState } from "react";

interface UserCardProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    cooldownEndsAt?: string | null;
    role?: "admin" | "teacher" | "student";
  };
  onSetCooldown: (userId: string, days: number) => void;
  onToggleAdmin: (userId: string, isAdmin: boolean) => void;
}

export default function UserCard({ user, onSetCooldown, onToggleAdmin }: UserCardProps) {
  const [cooldownDays, setCooldownDays] = useState("");
  const [isPromotingToAdmin, setIsPromotingToAdmin] = useState(user.role === "admin");
  const [isLoading, setIsLoading] = useState(false);

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "teacher":
        return "bg-blue-100 text-blue-800";
      case "student":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSetCooldown = () => {
    const days = parseInt(cooldownDays, 10);

    if (!Number.isFinite(days) || days <= 0) {
      window.alert("Please enter a valid cooldown in days.");
      return;
    }

    onSetCooldown(user.id, days);
    setCooldownDays("");
  };

  const handleToggleAdmin = async () => {
    const newAdminStatus = !isPromotingToAdmin;
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, isAdmin: newAdminStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        window.alert(errorData.error || "Failed to update admin status");
        setIsLoading(false);
        return;
      }

      setIsPromotingToAdmin(newAdminStatus);
      onToggleAdmin(user.id, newAdminStatus);
    } catch (error) {
      console.error(error);
      window.alert("Failed to update admin status");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCooldownStatus = () => {
    if (!user.cooldownEndsAt) {
      return {
        text: "No active cooldown",
        className: "text-gray-700",
      };
    }

    const endsDate = new Date(user.cooldownEndsAt);
    const now = new Date();

    if (endsDate <= now) {
      return {
        text: "Cooldown expired",
        className: "text-green-600 font-medium",
      };
    }

    return {
      text: `Cooldown active until ${endsDate.toLocaleDateString()}`,
      className: "text-red-600 font-medium",
    };
  };

  const cooldownStatus = formatCooldownStatus();

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 hover:shadow-xl transition-shadow duration-200">
      <div className="flex flex-col gap-4">
        {/* User Info Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              {user.role && (
                <span className={`text-xs font-bold px-2 py-1 rounded ${getRoleBadgeColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className={`text-sm mt-2 ${cooldownStatus.className}`}>
              {cooldownStatus.text}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Cooldown (days)
              </label>
              <input
                type="number"
                min={1}
                value={cooldownDays}
                onChange={(e) => setCooldownDays(e.target.value)}
                className="w-36 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="e.g. 3"
              />
            </div>

            <button
              onClick={handleSetCooldown}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer"
            >
              Set Cooldown
            </button>
          </div>
        </div>

        {/* Admin Promotion Section */}
        <div className="border-t pt-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Admin Status</h4>
            <p className="text-sm text-gray-600">
              {isPromotingToAdmin
                ? "This user is an admin"
                : "This user is not an admin"}
            </p>
          </div>
          <button
            onClick={handleToggleAdmin}
            disabled={isLoading || isPromotingToAdmin}
            className={`font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              isPromotingToAdmin
                ? "bg-purple-600 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-gray-900"
            }`}
          >
            {isLoading ? "Updating..." : isPromotingToAdmin ? "Admin (Cannot Remove)" : "Make Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}
