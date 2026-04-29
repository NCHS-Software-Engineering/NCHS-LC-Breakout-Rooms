"use client";

import { useRouter } from "next/navigation";
import DashboardCard from "./DashboardCard";

export default function DashboardGrid() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        title="Welcome"
        description="You are now logged in as an administrator"
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
          label: "Manage Reservations",
          onClick: () => router.push("/admin/reservations"),
        }}
      />
    </div>
  );
}
