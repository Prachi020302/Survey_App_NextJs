import { configureStore } from "@reduxjs/toolkit";
import {
  analyticsReducer,
  fetchAnalytics,
  resetAnalyticsState,
  setAnalyticsError,
} from "../../src/app/redux/slices/analyticsSlice";
import { mockAnalyticsData } from "./__mocks__/mockData";

// Mock axios
jest.mock("axios");

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("analyticsSlice", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        analytics: analyticsReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    test("should have correct initial state", () => {
      const state = store.getState() as any;
      expect(state.analytics).toEqual({
        loading: false,
        error: null,
        data: null,
      });
    });
  });

  describe("synchronous actions", () => {
    test("should handle resetAnalyticsState", () => {
      // First set some state
      store.dispatch(
        setAnalyticsError({
          statusCode: "500",
          message: "Test error",
        })
      );

      // Then reset
      store.dispatch(resetAnalyticsState());

      const state = store.getState() as any;
      expect(state.analytics.error).toBeNull();
      expect(state.analytics.data).toBeNull();
    });

    test("should handle setAnalyticsError", () => {
      const errorPayload = {
        statusCode: "404",
        message: "Analytics not found",
      };

      store.dispatch(setAnalyticsError(errorPayload));

      const state = store.getState() as any;
      expect(state.analytics.error).toEqual(errorPayload);
    });
  });

  describe("reducer actions", () => {
    test("should handle fetchAnalytics.pending", () => {
      const action = { type: fetchAnalytics.pending.type };
      const state = analyticsReducer(undefined, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test("should handle fetchAnalytics.fulfilled", () => {
      const mockPayload = {
        success: true,
        data: mockAnalyticsData,
      };

      const action = {
        type: fetchAnalytics.fulfilled.type,
        payload: mockPayload,
      };

      const state = analyticsReducer(undefined, action);

      expect(state.loading).toBe(false);
      expect(state.data).toEqual(mockAnalyticsData);
      expect(state.error).toBeNull();
    });

    test("should handle fetchAnalytics.rejected", () => {
      const errorPayload = {
        statusCode: "500",
        message: "Failed to fetch analytics",
      };

      const action = {
        type: fetchAnalytics.rejected.type,
        payload: errorPayload,
      };

      const state = analyticsReducer(undefined, action);

      expect(state.loading).toBe(false);
      expect(state.error).toEqual(errorPayload);
    });
  });

  describe("edge cases", () => {
    test("should handle state updates correctly when called multiple times", () => {
      // Start loading
      store.dispatch({ type: fetchAnalytics.pending.type });
      expect((store.getState() as any).analytics.loading).toBe(true);

      // Set error
      store.dispatch(
        setAnalyticsError({
          statusCode: "400",
          message: "Bad request",
        })
      );
      expect((store.getState() as any).analytics.error?.message).toBe(
        "Bad request"
      );

      // Fulfill request (should clear error)
      store.dispatch({
        type: fetchAnalytics.fulfilled.type,
        payload: {
          success: true,
          data: mockAnalyticsData,
        },
      });

      const finalState = (store.getState() as any).analytics;
      expect(finalState.loading).toBe(false);
      expect(finalState.error).toBeNull();
      expect(finalState.data).toEqual(mockAnalyticsData);
    });

    test("should handle empty analytics data", () => {
      const emptyData = {
        totalSurveys: 0,
        totalResponses: 0,
        totalUsers: 0,
        chartData: {
          dates: [],
          surveys: [],
          responses: [],
        },
      };

      const action = {
        type: fetchAnalytics.fulfilled.type,
        payload: {
          success: true,
          data: emptyData,
        },
      };

      const state = analyticsReducer(undefined, action);

      expect(state.loading).toBe(false);
      expect(state.data).toEqual(emptyData);
      expect(state.error).toBeNull();
    });

    test("should handle rejected action without payload", () => {
      const action = {
        type: fetchAnalytics.rejected.type,
        payload: undefined,
      };

      const state = analyticsReducer(undefined, action);

      expect(state.loading).toBe(false);
      expect(state.error).toEqual({
        statusCode: "500",
        message: "Failed to fetch analytics",
      });
    });
  });
});
