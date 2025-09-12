import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { AnalyticsData, DateRangePayload } from "@/types/Analytics";

interface AnalyticsState {
  loading: boolean;
  error: {
    statusCode: string;
    message: string;
  } | null;
  data: AnalyticsData | null;
}

const initialState: AnalyticsState = {
  loading: false,
  error: null,
  data: null,
};

// Fetch analytics data
export const fetchAnalytics = createAsyncThunk<
  { success: boolean; data: AnalyticsData; error?: string },
  DateRangePayload,
  { rejectValue: { statusCode: string; message: string } }
>("analytics/fetchAnalytics", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/dashboard/analytics", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = response.data as { success: boolean; data: AnalyticsData; error?: string };

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch analytics data");
    }

    return result;
  } catch (err: unknown) {
    let errorMessage = "An error occurred";
    let statusCode = "500";

    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === 'object' && err !== null && 'response' in err) {
      const axiosErr = err as { response?: { data?: { message?: string; statusCode?: string } } };
      errorMessage = axiosErr.response?.data?.message || errorMessage;
      statusCode = axiosErr.response?.data?.statusCode || statusCode;
    }

    toast.error(errorMessage);
    return rejectWithValue({
      statusCode,
      message: errorMessage,
    });
  }
});

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    resetAnalyticsState: (state) => {
      state.error = null;
      state.data = null;
    },
    setAnalyticsError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.error = null;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { statusCode: "500", message: "Failed to fetch analytics" };
      });
  },
});

export const { resetAnalyticsState, setAnalyticsError } = analyticsSlice.actions;
export const analyticsReducer = analyticsSlice.reducer;
