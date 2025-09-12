import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import translations from "@/Backend/utils/translate";

interface ResponseAnswer {
  questionId: string;
  selectedOptions: string[];
}

interface ResponseData {
  surveyId: string;
  userId?: string;
  answers: ResponseAnswer[];
}

interface ResponseState {
  loading: boolean;
  error: {
    statusCode: string;
    message: string;
  } | null;
  submissionSuccess: boolean;
  currentResponse: unknown | null;
  userResponses: {
    data: unknown[];
    count: number;
  };
  allResponses: {
    data: unknown[];
    count: number;
  };
}

const initialState: ResponseState = {
  loading: false,
  error: null,
  submissionSuccess: false,
  currentResponse: null,
  userResponses: {
    data: [],
    count: 0,
  },
  allResponses: {
    data: [],
    count: 0,
  },
};

export const submitResponse = createAsyncThunk<
  { statusCode: number; message: string; data?: unknown },
  ResponseData,
  { rejectValue: { statusCode: string; message: string } }
>("response/submitResponse", async (responseData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/responses", responseData);
    toast.success("Response submitted successfully!");
    return response.data as {
      statusCode: number;
      message: string;
      data?: unknown;
    };
  } catch (err: unknown) {
    const error = (
      err as { response?: { data?: { statusCode: string; message: string } } }
    )?.response?.data || {
      statusCode: "500",
      message: "Internal server error",
    };
    toast.error(error.message || translations.internalError);
    return rejectWithValue({
      statusCode: error.statusCode || "500",
      message: error.message || translations.internalError,
    });
  }
});

// Fetch user responses
export const getUserResponses = createAsyncThunk<
  { statusCode: number; message: string; data: unknown[]; count: number },
  string,
  { rejectValue: { statusCode: string; message: string } }
>("response/getUserResponses", async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/responses/user/${userId}`);
    return response.data as {
      statusCode: number;
      message: string;
      data: unknown[];
      count: number;
    };
  } catch (err: unknown) {
    const error = (
      err as { response?: { data?: { statusCode: string; message: string } } }
    )?.response?.data || {
      statusCode: "500",
      message: "Internal server error",
    };
    toast.error(error.message || translations.internalError);
    return rejectWithValue({
      statusCode: error.statusCode || "500",
      message: error.message || translations.internalError,
    });
  }
});

// Fetch all responses (for admin)
export const getAllResponses = createAsyncThunk<
  { statusCode: number; message: string; data: unknown[]; count: number },
  void,
  { rejectValue: { statusCode: string; message: string } }
>("response/getAllResponses", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/responses");
    return response.data as {
      statusCode: number;
      message: string;
      data: unknown[];
      count: number;
    };
  } catch (err: unknown) {
    const error = (
      err as { response?: { data?: { statusCode: string; message: string } } }
    )?.response?.data || {
      statusCode: "500",
      message: "Internal server error",
    };
    toast.error(error.message || translations.internalError);
    return rejectWithValue({
      statusCode: error.statusCode || "500",
      message: error.message || translations.internalError,
    });
  }
});

// Fetch single response by ID
export const getResponseById = createAsyncThunk<
  { statusCode: number; message: string; data: unknown },
  string,
  { rejectValue: { statusCode: string; message: string } }
>("response/getResponseById", async (responseId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/responses/${responseId}`);
    return response.data as {
      statusCode: number;
      message: string;
      data: unknown;
    };
  } catch (err: unknown) {
    const error = (
      err as { response?: { data?: { statusCode: string; message: string } } }
    )?.response?.data || {
      statusCode: "500",
      message: "Internal server error",
    };
    toast.error(error.message || translations.internalError);
    return rejectWithValue({
      statusCode: error.statusCode || "500",
      message: error.message || translations.internalError,
    });
  }
});

const responseSlice = createSlice({
  name: "response",
  initialState,
  reducers: {
    resetSubmissionState: (state) => {
      state.submissionSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submissionSuccess = false;
      })
      .addCase(submitResponse.fulfilled, (state) => {
        state.loading = false;
        state.submissionSuccess = true;
        state.error = null;
      })
      .addCase(submitResponse.rejected, (state, action) => {
        state.loading = false;
        state.submissionSuccess = false;
        state.error = {
          statusCode: action.payload?.statusCode || "500",
          message: action.payload?.message || translations.internalError,
        };
      })

      // Get user responses
      .addCase(getUserResponses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserResponses.fulfilled, (state, action) => {
        state.loading = false;
        state.userResponses = {
          data: action.payload.data,
          count: action.payload.count,
        };
        state.error = null;
      })
      .addCase(getUserResponses.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          statusCode: action.payload?.statusCode || "500",
          message: action.payload?.message || translations.internalError,
        };
      })

      // Get all responses (admin)
      .addCase(getAllResponses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllResponses.fulfilled, (state, action) => {
        state.loading = false;
        state.allResponses = {
          data: action.payload.data,
          count: action.payload.count,
        };
        state.error = null;
      })
      .addCase(getAllResponses.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          statusCode: action.payload?.statusCode || "500",
          message: action.payload?.message || translations.internalError,
        };
      })

      // Get response by ID
      .addCase(getResponseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getResponseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResponse = action.payload.data;
        state.error = null;
      })
      .addCase(getResponseById.rejected, (state, action) => {
        state.loading = false;
        state.currentResponse = null;
        state.error = {
          statusCode: action.payload?.statusCode || "500",
          message: action.payload?.message || translations.internalError,
        };
      });
  },
});

export const { resetSubmissionState } = responseSlice.actions;
export const { reducer: responseReducer } = responseSlice;
