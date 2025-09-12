"use client";

import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { useDispatch as useAppDispatch } from "react-redux";

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
});

const { dispatch } = store;

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// Custom hook to use dispatch with correct type
const useDispatch = () => useAppDispatch<AppDispatch>();

export { store, dispatch, useDispatch };
