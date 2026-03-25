"use client";

import { useState } from "react";

interface UserCardProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    cooldownEndsAt?: string | null;
  };
  onSetCooldown: (userId: string, days: number) => void;
}

export default function UserCard({ user, onSetCooldown }: UserCardProps) {
  const [cooldownDays, setCooldownDays] = useState("");

  const handleSetCooldown = () => {
    const days = parseInt(cooldownDays, 10);

    if (!Number.isFinite(days) || days <= 0) {
      window.alert("Please enter a valid cooldown in days.");
      return;
    }

    onSetCooldown(user.id, days);
    setCooldownDays("");
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </h3>
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
    </div>
  );
}
