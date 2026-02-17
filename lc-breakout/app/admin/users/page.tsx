"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface ManagedUser {
  id: string;
  firstName: string;
  lastName: string;
  cooldownEndsAt?: string;
}

export default function ManageUsersPage() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<"name" | "id">("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<ManagedUser[]>([
    { id: "12345", firstName: "John", lastName: "Doe" },
    { id: "23456", firstName: "Alice", lastName: "Williams" },
  ]);
  const [cooldownDaysById, setCooldownDaysById] = useState<Record<string, string>>({});

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isIdQueryValid = searchType !== "id" || /^\d{5}$/.test(normalizedQuery);

  const filteredUsers = useMemo(() => {
    if (!normalizedQuery) {
      return users;
    }

    if (searchType === "id") {
      return users.filter((user) => user.id === normalizedQuery);
    }

    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(normalizedQuery);
    });
  }, [normalizedQuery, searchType, users]);

  const setCooldown = (userId: string) => {
    const rawDays = cooldownDaysById[userId] ?? "";
    const cooldownDays = parseInt(rawDays, 10);

    if (!Number.isFinite(cooldownDays) || cooldownDays <= 0) {
      window.alert("Please enter a valid cooldown in days.");
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + cooldownDays);

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, cooldownEndsAt: expiresAt.toISOString() }
          : user
      )
    );
  };

  const formatCooldownStatus = (cooldownEndsAt?: string) => {
    if (!cooldownEndsAt) {
      return "No active cooldown";
    }

    const endsDate = new Date(cooldownEndsAt);
    const now = new Date();

    if (endsDate <= now) {
      return "Cooldown expired";
    }

    return `Cooldown active until ${endsDate.toLocaleDateString()}`;
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <nav className="bg-white shadow-md border-b border-red-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-red-600 hover:text-red-800 font-semibold transition duration-200"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900">Search Users</h2>
          <p className="text-gray-600 mt-1">
            Search by first and last name or by 5-digit student ID.
          </p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Search Type</label>
              <select
                value={searchType}
                onChange={(event) => {
                  setSearchType(event.target.value as "name" | "id");
                  setSearchQuery("");
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
              >
                <option value="name">First + Last Name</option>
                <option value="id">5-digit ID</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {searchType === "name" ? "Name" : "Student ID"}
              </label>
              <input
                type="text"
                value={searchQuery}
                maxLength={searchType === "id" ? 5 : undefined}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={searchType === "name" ? "e.g. John Doe" : "e.g. 12345"}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
              />
              {searchType === "id" && searchQuery && !isIdQueryValid && (
                <p className="mt-2 text-sm text-red-600">ID must be exactly 5 numbers.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {normalizedQuery && searchType === "id" && !isIdQueryValid ? (
            <div className="bg-white rounded-lg shadow p-5 text-gray-700">
              Enter a valid 5-digit ID to search.
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-5 text-gray-700">No users found.</div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow-lg p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {user.id}</p>
                    <p className="text-sm text-gray-700 mt-1">{formatCooldownStatus(user.cooldownEndsAt)}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Cooldown (days)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={cooldownDaysById[user.id] ?? ""}
                        onChange={(event) =>
                          setCooldownDaysById((prev) => ({
                            ...prev,
                            [user.id]: event.target.value,
                          }))
                        }
                        className="w-36 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                        placeholder="e.g. 3"
                      />
                    </div>

                    <button
                      onClick={() => setCooldown(user.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
                    >
                      Set Cooldown
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
