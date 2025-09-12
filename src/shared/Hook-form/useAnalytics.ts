import { useCallback } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { DateRangePayload } from "@/types/Analytics";
import { dispatch } from "@/app/redux/store";
import { fetchAnalytics } from "@/app/redux/slices/analyticsSlice";
import {
  selectAnalyticsData,
  selectAnalyticsLoading,
  selectAnalyticsError,
} from "@/app/redux/selector/analytics";

export const useAnalytics = () => {
  const data = useSelector(selectAnalyticsData, shallowEqual);
  const loading = useSelector(selectAnalyticsLoading, shallowEqual);
  const error = useSelector(selectAnalyticsError, shallowEqual);

  const fetchAnalyticsData = useCallback(async (payload: DateRangePayload) => {
    await dispatch(fetchAnalytics(payload));
  }, []);

  return {
    data,
    loading,
    error: error?.message || null,
    fetchAnalytics: fetchAnalyticsData,
  };
};
