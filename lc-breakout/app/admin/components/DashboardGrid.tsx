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
        title="Breakout Rooms"
        description="Manage LC breakout room settings and reservations"
        action={{
          label: "Manage Rooms",
          onClick: () => router.push("/admin/manage-rooms"),
        }}
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
          label: "View Reservations",
          onClick: () => router.push("/admin/reservations"),
        }}
      />

      <DashboardCard
        title="Reports"
        description="View usage history and statistics"
        action={{
          label: "View Reports",
          onClick: () => router.push("/admin/reports"),
        }}
      />

      <DashboardCard
        title="Settings"
        description="Configure system settings"
        action={{
          label: "Go to Settings",
          onClick: () => alert("Settings page coming soon!"),
        }}
      />
    </div>
  );
}
