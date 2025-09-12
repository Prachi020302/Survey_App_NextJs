"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface LoginPayload {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  register: {
    firstName: string;
    lastName: string;
    email: string;
  };
  login: { id: string; email: string; role: string };
  isLoading: boolean;
  error: { statusCode: string; message: string } | null;
}

const initialState: AuthState = {
  register: { firstName: "", lastName: "", email: "" },
  login: { id: "", email: "", role: "" },
  isLoading: false,
  error: null,
};

// register thunk using axios
export const registerUser = createAsyncThunk<
  void,
  { firstName: string; lastName: string; email: string; password: string },
  { rejectValue: { statusCode: string; message: string } }
>("auth/registerUser", async (payload, { rejectWithValue }) => {
  try {
    await axios.post("/api/register", payload);
  } catch (err) {
    const error = err as { statusCode: string; message: string };
    return rejectWithValue({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});

// login thunk using axios
export const loginUser = createAsyncThunk<
  { data: LoginPayload },
  { email: string; password: string },
  { rejectValue: { statusCode: string; message: string } }
>("auth/loginUser", async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.post<{ id: string; email: string; role: string }>(
      "/api/login",
      payload,
      {
        withCredentials: true,
      }
    );
    return { data: { id: res.data.id, email: res.data.email, role: res.data.role } };
  } catch (err) {
    const error = err as { statusCode: string; message: string };
    return rejectWithValue({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});

export const getUser = createAsyncThunk<
  { id: string; email: string; role: string },
  void,
  { rejectValue: { statusCode: string; message: string } }
>("auth/getUser", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("/api/login", { withCredentials: true });
    return res.data as { id: string; email: string; role: string };
  } catch (err) {
    const error = err as { statusCode: string; message: string };
    return rejectWithValue({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (
      state,
      action: PayloadAction<{ id: string; email: string; role: string }>
    ) => {
      state.login = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLogout: (state) => {
      state.login = { id: "", email: "", role: "" };
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.register = action.meta.arg;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = {
        statusCode: action.payload?.statusCode || "500",
        message: action.payload?.message || "Registration failed",
      };
    });

    // login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.login = {
        id: action.payload.data.id,
        email: action.payload.data.email,
        role: action.payload.data.role,
      };
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.error = {
          statusCode: action.payload.statusCode || "500",
          message: action.payload.message || "Login failed",
        };
      } else {
        state.error = {
          statusCode: "500",
          message: "Login failed",
        };
      }
    });

    // getUser
    builder.addCase(getUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.login = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = {
        statusCode: action.payload?.statusCode || "500",
        message: action.payload?.message || "Fetching user failed",
      };
    });
  },
});

export const authActions = authSlice.actions;
export const { reducer: authReducer } = authSlice;
