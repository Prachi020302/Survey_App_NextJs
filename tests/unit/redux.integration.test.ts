import { createTestStore } from "./__mocks__/testUtils";
import {
  mockUsers,
  mockSurveys,
  mockResponses,
  mockAnalyticsData,
  mockAuthState,
  mockAdminAuthState,
} from "./__mocks__/mockData";

describe("Redux Integration Tests", () => {
  describe("Store Configuration", () => {
    test("should create a store with all required slices", () => {
      const store = createTestStore();
      const state = store.getState();

      expect(state).toHaveProperty("auth");
      expect(state).toHaveProperty("survey");
      expect(state).toHaveProperty("response");
      expect(state).toHaveProperty("profile");
      expect(state).toHaveProperty("analytics");
    });

    test("should initialize with correct default states", () => {
      const store = createTestStore();
      const state = store.getState() as any;

      // Auth slice
      expect(state.auth.isAuthenticated).toBe(undefined);
      expect(state.auth.user).toBeNull();
      expect(state.auth.token).toBeNull();
      expect(state.auth.loading).toBe(false);
      expect(state.auth.error).toBeNull();

      // Survey slice
      expect(state.survey.surveys).toEqual([]);
      expect(state.survey.currentSurvey).toBeNull();
      expect(state.survey.loading).toBe(false);
      expect(state.survey.error).toBeNull();
      expect(state.survey.count).toBe(0);

      // Response slice
      expect(state.response.loading).toBe(false);
      expect(state.response.error).toBeNull();
      expect(state.response.submissionSuccess).toBe(false);
      expect(state.response.currentResponse).toBeNull();

      // Profile slice
      expect(state.profile.loading).toBe(false);
      expect(state.profile.error).toBeNull();
      expect(state.profile.profileData).toBeNull();
      expect(state.profile.updateSuccess).toBe(false);

      // Analytics slice
      expect(state.analytics.loading).toBe(false);
      expect(state.analytics.error).toBeNull();
      expect(state.analytics.data).toBeNull();
    });

    test("should handle custom initial state", () => {
      const customState = {
        auth: {
          isAuthenticated: true,
          user: mockUsers[0],
          token: "test-token",
          loading: false,
          error: null,
        },
        analytics: {
          loading: false,
          error: null,
          data: mockAnalyticsData,
        },
      };

      const store = createTestStore(customState);
      const state = store.getState() as any;

      expect(state.auth.isAuthenticated).toBe(true);
      expect(state.auth.user).toEqual(mockUsers[0]);
      expect(state.analytics.data).toEqual(mockAnalyticsData);
    });
  });

  describe("State Transitions", () => {
    test("should handle loading states correctly", () => {
      const store = createTestStore();

      // Test analytics loading state
      store.dispatch({
        type: "analytics/fetchAnalytics/pending",
      });

      let state = store.getState() as any;
      expect(state.analytics.loading).toBe(true);
      expect(state.analytics.error).toBeNull();

      // Test fulfilled state
      store.dispatch({
        type: "analytics/fetchAnalytics/fulfilled",
        payload: {
          success: true,
          data: mockAnalyticsData,
        },
      });

      state = store.getState() as any;
      expect(state.analytics.loading).toBe(false);
      expect(state.analytics.data).toEqual(mockAnalyticsData);
      expect(state.analytics.error).toBeNull();
    });

    test("should handle error states correctly", () => {
      const store = createTestStore();
      const errorPayload = {
        statusCode: "500",
        message: "Internal Server Error",
      };

      store.dispatch({
        type: "analytics/fetchAnalytics/rejected",
        payload: errorPayload,
      });

      const state = store.getState() as any;
      expect(state.analytics.loading).toBe(false);
      expect(state.analytics.error).toEqual(errorPayload);
      expect(state.analytics.data).toBeNull();
    });

    test("should handle state resets correctly", () => {
      const store = createTestStore();

      // Set some initial state
      store.dispatch({
        type: "analytics/setAnalyticsError",
        payload: {
          statusCode: "400",
          message: "Bad Request",
        },
      });

      // Verify error is set
      let state = store.getState() as any;
      expect(state.analytics.error).not.toBeNull();

      // Reset state
      store.dispatch({
        type: "analytics/resetAnalyticsState",
      });

      state = store.getState() as any;
      expect(state.analytics.error).toBeNull();
      expect(state.analytics.data).toBeNull();
    });
  });

  describe("Data Consistency", () => {
    test("should maintain referential integrity in mock data", () => {
      // Check that response survey IDs exist in surveys
      const surveyIds = mockSurveys.map((survey) => survey.id);
      mockResponses.forEach((response) => {
        expect(surveyIds).toContain(response.surveyId);
      });

      // Check that response user IDs exist in users
      const userIds = mockUsers.map((user) => user.id);
      mockResponses.forEach((response) => {
        expect(userIds).toContain(response.userId);
      });

      // Check that survey creators exist in users
      mockSurveys.forEach((survey) => {
        expect(userIds).toContain(survey.createdBy);
      });
    });

    test("should have consistent analytics data", () => {
      const userRoleUsers = mockUsers.filter((user) => user.role === "User");

      expect(mockAnalyticsData.totalSurveys).toBe(mockSurveys.length);
      expect(mockAnalyticsData.totalResponses).toBe(mockResponses.length);
      expect(mockAnalyticsData.totalUsers).toBe(userRoleUsers.length);
    });

    test("should have valid date formats", () => {
      // Check user dates
      mockUsers.forEach((user) => {
        expect(user.createdAt).toBeInstanceOf(Date);
        expect(user.updatedAt).toBeInstanceOf(Date);
        expect(user.createdAt.getTime()).toBeLessThanOrEqual(
          user.updatedAt.getTime()
        );
      });

      // Check survey dates
      mockSurveys.forEach((survey) => {
        expect(survey.createdAt).toBeInstanceOf(Date);
        expect(survey.updatedAt).toBeInstanceOf(Date);
        expect(survey.createdAt.getTime()).toBeLessThanOrEqual(
          survey.updatedAt.getTime()
        );
      });

      // Check response dates
      mockResponses.forEach((response) => {
        expect(response.submittedAt).toBeInstanceOf(Date);
        expect(response.createdAt).toBeInstanceOf(Date);
        expect(response.updatedAt).toBeInstanceOf(Date);
      });
    });
  });

  describe("Authentication States", () => {
    test("should properly configure authenticated user state", () => {
      const userAuthState = {
        auth: {
          isAuthenticated: true,
          user: mockUsers[0],
          token: mockAuthState.token,
          id: mockAuthState.id,
          email: mockAuthState.email,
          role: mockAuthState.role,
          firstName: mockAuthState.firstName,
          lastName: mockAuthState.lastName,
          loading: false,
          error: null,
        },
      };

      const store = createTestStore(userAuthState);
      const state = store.getState();

      expect((state as any).auth.isAuthenticated).toBe(true);
      expect((state as any).auth.role).toBe("User");
      expect((state as any).auth.user).toBeDefined();
      expect((state as any).auth.token).toBeDefined();
    });

    test("should properly configure authenticated admin state", () => {
      const adminAuthState = {
        auth: {
          isAuthenticated: true,
          user: mockUsers[1], // Admin user
          token: mockAdminAuthState.token,
          id: mockAdminAuthState.id,
          email: mockAdminAuthState.email,
          role: mockAdminAuthState.role,
          firstName: mockAdminAuthState.firstName,
          lastName: mockAdminAuthState.lastName,
          loading: false,
          error: null,
        },
      };

      const store = createTestStore(adminAuthState);
      const state = store.getState();

      expect((state as any).auth.isAuthenticated).toBe(true);
      expect((state as any).auth.role).toBe("Admin");
      expect((state as any).auth.user).toBeDefined();
      expect((state as any).auth.token).toBeDefined();
    });

    test("should differentiate between user and admin permissions", () => {
      const userAuthState = {
        auth: {
          ...mockAuthState,
          user: mockUsers[0],
          loading: false,
          error: null,
        },
      };
      const adminAuthState = {
        auth: {
          ...mockAdminAuthState,
          user: mockUsers[1],
          loading: false,
          error: null,
        },
      };

      const userStore = createTestStore(userAuthState);
      const adminStore = createTestStore(adminAuthState);

      const userState = userStore.getState();
      const adminState = adminStore.getState();

      expect((userState as any).auth.role).toBe("User");
      expect((adminState as any).auth.role).toBe("Admin");
      expect((userState as any).auth.id).not.toBe((adminState as any).auth.id);
    });
  });

  describe("Complex State Operations", () => {
    test("should handle multiple simultaneous operations", () => {
      const store = createTestStore();

      // Start multiple loading operations
      store.dispatch({ type: "analytics/fetchAnalytics/pending" });
      store.dispatch({ type: "profile/fetchProfile/pending" });

      let state = store.getState() as any;
      expect(state.analytics.loading).toBe(true);
      expect(state.profile.loading).toBe(true);

      // Complete analytics operation
      store.dispatch({
        type: "analytics/fetchAnalytics/fulfilled",
        payload: { success: true, data: mockAnalyticsData },
      });

      state = store.getState() as any;
      expect(state.analytics.loading).toBe(false);
      expect(state.analytics.data).toEqual(mockAnalyticsData);
      expect(state.profile.loading).toBe(true); // Still loading
    });

    test("should maintain state isolation between slices", () => {
      const store = createTestStore();

      // Set error in analytics
      store.dispatch({
        type: "analytics/setAnalyticsError",
        payload: { statusCode: "500", message: "Analytics error" },
      });

      const state = store.getState() as any;
      expect(state.analytics.error).not.toBeNull();
      expect(state.survey.error).toBeNull();
      expect(state.response.error).toBeNull();
      expect(state.profile.error).toBeNull();
    });

    test("should handle rapid state changes correctly", () => {
      const store = createTestStore();

      // Rapid fire state changes
      for (let i = 0; i < 10; i++) {
        store.dispatch({ type: "analytics/fetchAnalytics/pending" });
        store.dispatch({
          type: "analytics/fetchAnalytics/fulfilled",
          payload: { success: true, data: mockAnalyticsData },
        });
      }

      const state = store.getState() as any;
      expect(state.analytics.loading).toBe(false);
      expect(state.analytics.data).toEqual(mockAnalyticsData);
      expect(state.analytics.error).toBeNull();
    });
  });

  describe("Performance and Memory", () => {
    test("should handle large state objects efficiently", () => {
      const largeData = {
        ...mockAnalyticsData,
        chartData: {
          dates: Array.from(
            { length: 1000 },
            (_, i) => `2024-01-${(i % 30) + 1}`
          ),
          surveys: Array.from({ length: 1000 }, () =>
            Math.floor(Math.random() * 100)
          ),
          responses: Array.from({ length: 1000 }, () =>
            Math.floor(Math.random() * 200)
          ),
        },
      };

      const store = createTestStore();
      const startTime = performance.now();

      store.dispatch({
        type: "analytics/fetchAnalytics/fulfilled",
        payload: { success: true, data: largeData },
      });

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms

      const state = store.getState() as any;
      expect(state.analytics.data.chartData.dates).toHaveLength(1000);
    });
  });
});
