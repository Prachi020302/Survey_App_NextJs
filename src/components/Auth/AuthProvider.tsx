"use client";

import React, { useEffect } from "react";
import { getUser } from "@/app/redux/slices/authSlice";
import { dispatch } from "@/app/redux/store";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  useEffect(() => {
    try {
      dispatch(getUser());
      console.log("AuthProvider: Successfully loaded user from token");
    } catch {
      // User not authenticated or token expired, that's fine
      console.log("AuthProvider: User not authenticated on app load");
    }
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
