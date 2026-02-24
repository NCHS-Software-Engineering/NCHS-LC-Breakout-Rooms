"use client";

import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import SearchForm from "../components/SearchForm";
import UserCard from "../components/UserCard";
import EmptyState from "../components/EmptyState";

interface ManagedUser {
  id: string;
  firstName: string;
  lastName: string;
  cooldownEndsAt?: string;
}

export default function ManageUsersPage() {
  const [searchType, setSearchType] = useState<"name" | "id">("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<ManagedUser[]>([
    { id: "12345", firstName: "John", lastName: "Doe" },
    { id: "23456", firstName: "Alice", lastName: "Williams" },
  ]);

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

  const handleSetCooldown = (userId: string, cooldownDays: number) => {
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

  const renderContent = () => {
    if (normalizedQuery && searchType === "id" && !isIdQueryValid) {
      return <EmptyState message="Enter a valid 5-digit ID to search." icon="warning" />;
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
          isIdQueryValid={isIdQueryValid}
          onSearchTypeChange={setSearchType}
          onSearchQueryChange={setSearchQuery}
        />

        <div className="mt-6">{renderContent()}</div>
      </div>
    </main>
  );
}
