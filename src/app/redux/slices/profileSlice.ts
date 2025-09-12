import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import translations from "@/Backend/utils/translate";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

interface ProfileState {
  loading: boolean;
  error: {
    statusCode: string;
    message: string;
  } | null;
  profileData: UserProfile | null;
  updateSuccess: boolean;
}

const initialState: ProfileState = {
  loading: false,
  error: null,
  profileData: null,
  updateSuccess: false,
};

// Fetch user profile
export const fetchProfile = createAsyncThunk<
  { statusCode: number; message: string; data: UserProfile },
  void,
  { rejectValue: { statusCode: string; message: string } }
>("profile/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/profile", {
      withCredentials: true,
    });
    return response.data as { statusCode: number; message: string; data: UserProfile };
  } catch (err: unknown) {
    const error = (err as { response?: { data?: { statusCode: string; message: string } } })?.response?.data || { statusCode: "500", message: "Internal server error" };
    toast.error(error.message || translations.internalError);
    return rejectWithValue({
      statusCode: error.statusCode || "500",
      message: error.message || translations.internalError,
    });
  }
});

// Update user profile
export const updateProfile = createAsyncThunk<
  { statusCode: number; message: string; data: UserProfile },
  ProfileFormData,
  { rejectValue: { statusCode: string; message: string } }
>("profile/updateProfile", async (profileData, { rejectWithValue }) => {
  try {
    const response = await axios.put("/api/profile", profileData, {
      withCredentials: true,
    });
    toast.success("Profile updated successfully!");
    return response.data as { statusCode: number; message: string; data: UserProfile };
  } catch (err: unknown) {
    const error = (err as { response?: { data?: { statusCode: string; message: string } } })?.response?.data || { statusCode: "500", message: "Internal server error" };
    toast.error(error.message || translations.internalError);
    return rejectWithValue({
      statusCode: error.statusCode || "500",
      message: error.message || translations.internalError,
    });
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.error = null;
      state.updateSuccess = false;
    },
    setProfileError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload.data;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { statusCode: "500", message: "Failed to fetch profile" };
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload.data;
        state.updateSuccess = true;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.updateSuccess = false;
        state.error = action.payload || { statusCode: "500", message: "Failed to update profile" };
      });
  },
});

export const { resetProfileState, setProfileError } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
