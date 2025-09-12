"use client";

import translations from "@/Backend/utils/translate";
import { Field, Survey, SurveyListResponse, SurveyState } from "@/types/Survey";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const initialState: SurveyState = {
  surveys: { surveyList: [], count: 0 },
  currentSurvey: null,
  loading: false,
  error: null,
};

export const getSurveys = createAsyncThunk<
  { surveyList: Survey[]; count: number },
  void,
  { rejectValue: { statusCode: string; message: string } }
>("survey/getSurveys", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<SurveyListResponse>("/api/surveys");
    return {
      surveyList: response.data.surveyList,
      count: response.data.count,
    };
  } catch (err) {
    const error = err as { statusCode: string; message: string };

    toast.error(error.message || translations.internalError);
    return rejectWithValue({
      statusCode: error.statusCode,
      message: error.message || translations.internalError,
    });
  }
});

export const addSurvey = createAsyncThunk<
  Survey,
  { title: string; description?: string; questions: Field[] },
  { rejectValue: { statusCode: string; message: string } }
>("survey/addSurvey", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post<Survey>("/api/addSurvey", payload);
    return response.data;
  } catch (err) {
    const error = err as { statusCode: string; message: string };

    toast.error(error.message || translations.internalError);
    return rejectWithValue({
      statusCode: error.statusCode,
      message: error.message || translations.internalError,
    });
  }
});

export const getSurveyById = createAsyncThunk<
  { statusCode: number; message: string; data: Survey },
  string,
  { rejectValue: { statusCode: string; message: string } }
>("survey/getSurveyById", async (surveyId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/surveys/${surveyId}`);
    return response.data as { statusCode: number; message: string; data: Survey };
  } catch (err) {
    const error = (err as { response?: { data?: { statusCode: string; message: string } } })?.response?.data || { statusCode: "500", message: "Internal server error" };

    toast.error(error.message || translations.internalError);
    return rejectWithValue({
      statusCode: error.statusCode || "500",
      message: error.message || translations.internalError,
    });
  }
});

export const updateSurveyStatus = createAsyncThunk<
  Survey,
  { id: string; isActive: boolean },
  { rejectValue: { statusCode: string; message: string } }
>("survey/updateSurveyStatus", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.patch<Survey>(`/api/surveys`, payload);
    return response.data;
  } catch (err) {
    const error = err as { statusCode: string; message: string };

    toast.error(error.message || translations.internalError);
    return rejectWithValue({
      statusCode: error.statusCode,
      message: error.message || translations.internalError,
    });
  }
});

export const deleteSurvey = createAsyncThunk<
  { statusCode: number; message: string },
  string,
  { rejectValue: { statusCode: string; message: string } }
>("survey/deleteSurvey", async (surveyId, { rejectWithValue }) => {
  try {
    const response = await axios.delete<{ statusCode: number; message: string }>(`/api/surveys/${surveyId}`);
    toast.success(response.data.message || "Survey deleted successfully");
    return response.data;
  } catch (err) {
    const error = (err as { response?: { data?: { statusCode: string; message: string } } })?.response?.data || { statusCode: "500", message: "Internal server error" };

    toast.error(error.message || translations.internalError);
    return rejectWithValue({
      statusCode: error.statusCode || "500",
      message: error.message || translations.internalError,
    });
  }
});

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSurveys.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSurveys.fulfilled, (state, action) => {
        state.loading = false;
        state.surveys = {
          surveyList: action.payload.surveyList,
          count: action.payload.count,
        };
      })
      .addCase(getSurveys.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          statusCode: action.payload?.statusCode || "500",
          message: action.payload?.message || translations.internalError,
        };
      });

    builder
      .addCase(addSurvey.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSurvey.fulfilled, (state, action) => {
        state.surveys.surveyList.push(action.payload);
        state.surveys.count = state.surveys.surveyList.length;
        state.loading = false;
        state.error = null;
      })
      .addCase(addSurvey.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          statusCode: action.payload?.statusCode || "500",
          message: action.payload?.message || translations.internalError,
        };
      });

    builder
      .addCase(getSurveyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSurveyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSurvey = action.payload.data;
        const index = state.surveys.surveyList.findIndex(
          (survey) => survey.id === action.payload.data.id
        );
        if (index !== -1) {
          state.surveys.surveyList[index] = action.payload.data;
        }
        state.error = null;
      })
      .addCase(getSurveyById.rejected, (state, action) => {
        state.loading = false;
        state.currentSurvey = null;
        state.error = {
          statusCode: action.payload?.statusCode || "500",
          message: action.payload?.message || translations.internalError,
        };
      });

    builder.addCase(updateSurveyStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateSurveyStatus.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.surveys.surveyList.findIndex(
        (survey) => survey.id === action.payload.id
      );
      if (index !== -1) {
        state.surveys.surveyList[index] = action.payload;
      }
      state.error = null;
    });
    builder.addCase(updateSurveyStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = {
        statusCode: action.payload?.statusCode || "500",
        message: action.payload?.message || translations.internalError,
      };
    });

    builder
      .addCase(deleteSurvey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSurvey.fulfilled, (state, action) => {
        state.loading = false;
        state.surveys.surveyList = state.surveys.surveyList.filter(
          (survey) => survey.id !== action.meta.arg
        );
        state.surveys.count = state.surveys.surveyList.length;
        state.error = null;
      })
      .addCase(deleteSurvey.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          statusCode: action.payload?.statusCode || "500",
          message: action.payload?.message || translations.internalError,
        };
      });
  },
});

export const surveyAction = surveySlice.actions;
export const { reducer: surveyReducer } = surveySlice;
