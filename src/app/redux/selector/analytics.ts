import { RootState } from "../store";

export const selectAnalyticsLoading = (state: RootState) => state.analytics.loading;
export const selectAnalyticsError = (state: RootState) => state.analytics.error;
export const selectAnalyticsData = (state: RootState) => state.analytics.data;
