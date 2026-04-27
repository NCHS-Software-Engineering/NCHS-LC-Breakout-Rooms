"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import SearchForm from "../components/SearchForm";
import UserCard from "../components/UserCard";
import EmptyState from "../components/EmptyState";
import { ManagedUser } from "../lib/types";
import { useAdminGuard } from "../lib/useAdminGuard";

export default function ManageUsersPage() {
  const { isAuthorized, isCheckingAuth } = useAdminGuard();
  const [searchType, setSearchType] = useState<"name" | "id">("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [cooldownFilter, setCooldownFilter] = useState<"active" | "all">("active"); // Default to active
  const [roleFilter, setRoleFilter] = useState<"" | "admin" | "student">("");
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  useEffect(() => {
    if (!isAuthorized) {
      return;
    }

    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          searchType,
          query: normalizedQuery,
          cooldownFilter,
          roleFilter,
        });
        const response = await fetch(`/api/admin/users?${params.toString()}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(Array.isArray(data.users) ? data.users : []);
      } catch (error) {
        console.error(error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [isAuthorized, normalizedQuery, searchType, cooldownFilter, roleFilter]);

  const filteredUsers = useMemo(() => {
    return users;
  }, [users]);

  const handleSetCooldown = async (userId: string, cooldownDays: number) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, days: cooldownDays }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        window.alert(errorData.error || "Failed to set cooldown");
        return;
      }

      const data = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, cooldownEndsAt: data.cooldownEndsAt } : user
        )
      );
    } catch (error) {
      console.error(error);
      window.alert("Failed to set cooldown");
    }
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, role: isAdmin ? "admin" : "student" }
          : user
      )
    );
  };

  if (isCheckingAuth || !isAuthorized) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center">
        <p className="text-gray-700 font-semibold">Loading user management...</p>
      </div>
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return <EmptyState message="Loading users..." icon="search" />;
    }

    if (filteredUsers.length === 0) {
      return <EmptyState message="No users found." icon="search" />;
    }

    return (
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} onSetCooldown={handleSetCooldown} onToggleAdmin={handleToggleAdmin} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <PageHeader title="Manage Users" />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <SearchForm
          searchType={searchType}
          searchQuery={searchQuery}
          onSearchTypeChange={setSearchType}
          onSearchQueryChange={setSearchQuery}
        />

        {/* Filter Controls */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Cooldown Status:</span>
            <button
              onClick={() => setCooldownFilter("active")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                cooldownFilter === "active"
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Active Only
            </button>
            <button
              onClick={() => setCooldownFilter("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                cooldownFilter === "all"
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Users
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Role:</span>
            <button
              onClick={() => setRoleFilter("")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                roleFilter === ""
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Roles
            </button>
            <button
              onClick={() => setRoleFilter("admin")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                roleFilter === "admin"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Admins Only
            </button>
            <button
              onClick={() => setRoleFilter("student")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                roleFilter === "student"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Students Only
            </button>
          </div>
        </div>

        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  );
}
