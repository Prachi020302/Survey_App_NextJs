"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { LoginState, AuthLoading } from "@/app/redux/selector/auth";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Shared } from "@/locales/shared";

interface ReduxRoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallbackPath?: string;
}

const ReduxRoleGuard = ({
  allowedRoles,
  children,
  fallbackPath = "/unauthorized",
}: ReduxRoleGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const loginState = useSelector(LoginState);
  const isLoading = useSelector(AuthLoading);
  const { email, role } = loginState;
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Don't process if already checked or still loading
    if (authChecked || isLoading) {
      return;
    }

    // Skip check for login page
    if (pathname === "/login") {
      setAuthChecked(true);
      return;
    }

    // Set timeout to allow auth state to settle
    const timer = setTimeout(() => {
      setAuthChecked(true);

      // Check if user is authenticated
      if (!email || !role) {
        router.replace("/login");
        return;
      }

      // Check if user has required role
      if (!allowedRoles.includes(role)) {
        router.replace(fallbackPath);
        return;
      }
    }, 50); // Increased timeout to allow state to settle

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, role, isLoading, pathname, authChecked]);

  // Reset auth check when route changes
  useEffect(() => {
    setAuthChecked(false);
  }, [pathname, email, role]);

  // Show loading during auth check
  if (!authChecked || isLoading || (!email && pathname !== "/login")) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>{Shared.checkAuthentication}</Typography>
      </Box>
    );
  }

  // Show unauthorized if role doesn't match
  if (email && role && !allowedRoles.includes(role)) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          gap: 2,
        }}
      >
        <Typography variant="h5" color="error">
          {Shared.unauthorizedAccess}
        </Typography>
        <Typography color="text.secondary">{Shared.noPermission}</Typography>
      </Box>
    );
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};

export default ReduxRoleGuard;
