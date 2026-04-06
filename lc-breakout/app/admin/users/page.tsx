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
  }, [isAuthorized, normalizedQuery, searchType]);

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

  if (isCheckingAuth || !isAuthorized) {
    return (
      <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center">
        <p className="text-gray-700 font-semibold">Loading user management...</p>
      </main>
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
          <UserCard key={user.id} user={user} onSetCooldown={handleSetCooldown} />
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
          onSearchTypeChange={setSearchType}
          onSearchQueryChange={setSearchQuery}
        />

        <div className="mt-6">{renderContent()}</div>
      </div>
    </main>
  );
}
