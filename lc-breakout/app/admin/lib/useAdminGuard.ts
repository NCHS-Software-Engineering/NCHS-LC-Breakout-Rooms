"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function useAdminGuard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      router.replace("/admin/login");
      return;
    }

    if (session.user?.role !== "admin") {
      router.replace("/");
    }
  }, [router, session, status]);

  return {
    isAuthorized: status === "authenticated" && session?.user?.role === "admin",
    isCheckingAuth: status === "loading",
  };
}
