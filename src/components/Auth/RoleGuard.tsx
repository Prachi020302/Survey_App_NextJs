"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type RoleGuardProps = {
  role?: string | string[];
  children: React.ReactNode;
  fallbackPath?: string;
  unauthorizedPath?: string;
};

type SessionUser = {
  role?: string;
  [key: string]: unknown;
};

export default function RoleGuard({
  role,
  children,
  fallbackPath = "/auth/signin",
  unauthorizedPath = "/unauthorized",
}: RoleGuardProps) {
  const { status, data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && role) {
      const userRole = (session?.user as SessionUser)?.role;
      const allowed = Array.isArray(role)
        ? typeof userRole === "string" && role.includes(userRole)
        : userRole === role;
      if (!allowed) router.replace(unauthorizedPath);
    }
    if (status === "unauthenticated") {
      router.replace(fallbackPath);
    }
  }, [status, role, session, router, unauthorizedPath, fallbackPath]);

  if (status === "loading") return null;

  if (status === "authenticated" && role) {
    const userRole = (session?.user as SessionUser)?.role;
    const allowed = Array.isArray(role)
      ? typeof userRole === "string" && role.includes(userRole)
      : userRole === role;
    if (!allowed) return null;
  }

  return <>{children}</>;
}
