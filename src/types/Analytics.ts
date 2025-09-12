export interface AnalyticsData {
  totalSurveys: number;
  totalResponses: number;
  totalUsers: number;
  chartData: {
    dates: string[];
    surveys: number[];
    responses: number[];
  };
}

export interface DateRangePayload {
  startDate: string;
  endDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
