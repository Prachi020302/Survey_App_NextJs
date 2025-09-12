import { Survey_Data } from "../model/SurveyModel";
import { User_Data } from "../model/UserModel";
import { Response_Data } from "../model/ResponseModel";

interface AnalyticsData {
  totalSurveys: number;
  totalResponses: number;
  totalUsers: number;
  chartData: {
    dates: string[];
    surveys: number[];
    responses: number[];
  };
}

export const Analytics = async (
  startDate: string,
  endDate: string
): Promise<AnalyticsData> => {
  try {
    // Connect to database

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end date

    // Get total counts within date range for surveys and responses
    const [totalSurveys, totalResponses] = await Promise.all([
      Survey_Data.countDocuments({
        createdAt: { $gte: start, $lte: end },
        isActive: true,
      }),
      Response_Data.countDocuments({
        submittedAt: { $gte: start, $lte: end },
      }),
    ]);

    // For users, count only users with "User" role (excluding Admin users)
    // This makes more sense as user count typically represents end users
    const totalUsers = await User_Data.countDocuments({
      role: "User",
    });

    // Generate chart data for the date range
    const chartData = await generateChartData(start, end);

    return {
      totalSurveys,
      totalResponses,
      totalUsers,
      chartData,
    };
  } catch (error) {
    console.error("Analytics service error:", error);
    throw new Error("Failed to fetch analytics data");
  }
};

const generateChartData = async (
  startDate: Date,
  endDate: Date
): Promise<{
  dates: string[];
  surveys: number[];
  responses: number[];
}> => {
  const dates: string[] = [];
  const surveys: number[] = [];
  const responses: number[] = [];

  // Generate date range
  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    const dateStr = dt.toISOString().split("T")[0];
    dates.push(dateStr);

    // Get start and end of the day
    const dayStart = new Date(dt);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dt);
    dayEnd.setHours(23, 59, 59, 999);

    // Count surveys and responses for this day
    const [surveysCount, responsesCount] = await Promise.all([
      Survey_Data.countDocuments({
        createdAt: { $gte: dayStart, $lte: dayEnd },
        isActive: true,
      }),
      Response_Data.countDocuments({
        submittedAt: { $gte: dayStart, $lte: dayEnd },
      }),
    ]);

    surveys.push(surveysCount);
    responses.push(responsesCount);
  }

  return { dates, surveys, responses };
};
