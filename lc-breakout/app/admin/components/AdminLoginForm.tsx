"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminLoginForm() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      setIsCheckingAuth(false);
      return;
    }

    if (session.user?.role === "admin") {
      setIsAuthorized(true);
      setIsCheckingAuth(false);
      return;
    }

    setIsCheckingAuth(false);
  }, [session, status]);

  if (isCheckingAuth) {
    return (
      <div className="text-center py-8">
        <svg className="animate-spin h-8 w-8 mx-auto text-red-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-center">
        <p>Please log in as an admin to access this section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">
        You are logged in as an admin.
      </p>
      
      <button
        onClick={() => router.push("/admin/dashboard")}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
      >
        Admin Dashboard
      </button>
    </div>
  );
}
