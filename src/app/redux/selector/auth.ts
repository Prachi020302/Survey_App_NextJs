"use client";

import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const AuthState = (state: RootState) => state.auth;

// Register
export const RegisterState = createSelector(
  [AuthState],
  (auth) => auth.register
);

// Login
export const LoginState = createSelector([AuthState], (auth) => auth.login);

// loading
export const AuthLoading = createSelector(
  [AuthState],
  (auth) => auth.isLoading
);

// error
export const AuthError = createSelector([AuthState], (auth) => auth.error);

// token
export const AuthToken = createSelector([AuthState], (auth) => auth.token);
