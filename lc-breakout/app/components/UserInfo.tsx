'use client'

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function UserInfo() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (status === "loading") {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Please log in to see your role</p>
      </div>
    );
  }

  return (
    <div className="bg-red-400 p-6 rounded-lg shadow-md mb-6 border-red-400">
      <h2 className="text-2xl font-bold mb-4 text-red-900">Welcome</h2>
      <div className="space-y-2 text-red-900">
        <p><strong>Name:</strong> {session.user?.name}</p>
        <p><strong>Email:</strong> {session.user?.email}</p>
        <p>
          <strong>Role:     </strong>{" "}
          <span className={`px-3 py-1 rounded-full font-semibold ${
            session.user?.role === "admin" ? "bg-red-600 text-white" :
            session.user?.role === "staff" ? "bg-blue-600 text-white" :
            "bg-green-600 text-white"
          }`}>
            {session.user?.role?.toUpperCase() || "STUDENT"}
          </span>
        </p>
      </div>
    </div>
  );
}
