"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import SearchForm from "../components/SearchForm";
import UserCard from "../components/UserCard";
import EmptyState from "../components/EmptyState";

interface ManagedUser {
  id: string;
  name: string;
}

export default function ManageUsersPage() {
  const [searchType, setSearchType] = useState<"name" | "id">("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isIdQueryValid = searchType !== "id" || /^\w+$/.test(normalizedQuery);

  const filteredUsers = useMemo(() => {
    if (!isLoading && !normalizedQuery) {
      return users;
    }

    if (!isLoading && normalizedQuery) {
      if (searchType === "id") {
        return users.filter((user) => user.id.toLowerCase().includes(normalizedQuery));
      }

      return users.filter((user) =>
        user.name.toLowerCase().includes(normalizedQuery)
      );
    }

    return [];
  }, [normalizedQuery, searchType, users, isLoading]);

  const handleRemoveUser = async (userId: string, userName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to remove all reservations for ${userName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove user");
      }

      const data = await response.json();
      setUsers(users.filter((u) => u.id !== userId));
      alert(`${data.deletedCount} reservations removed for ${userName}`);
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Failed to remove user"}`);
      console.error("Error removing user:", err);
    }
  };
  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center py-12">Loading users...</div>;
    }

    if (error) {
      return <EmptyState message={`Error: ${error}`} icon="warning" />;
    }

    if (normalizedQuery && searchType === "id" && !isIdQueryValid) {
      return <EmptyState message="Enter a valid user ID to search." icon="warning" />;
    }

    if (filteredUsers.length === 0) {
      return <EmptyState message="No users found." icon="search" />;
    }

    return (
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-lg p-5 hover:shadow-xl transition-shadow duration-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">ID:</span> {user.id}
                </p>
              </div>

              <button
                onClick={() => handleRemoveUser(user.id, user.name)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer"
              >
                Remove All Reservations
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <PageHeader title="Manage Users" />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <SearchForm
          searchType={searchType}
          searchQuery={searchQuery}
          isIdQueryValid={isIdQueryValid}
          onSearchTypeChange={setSearchType}
          onSearchQueryChange={setSearchQuery}
        />

        <div className="mt-6">{renderContent()}</div>
      </div>
    </main>
  );
}
