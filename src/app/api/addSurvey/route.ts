import connectDB from "@/Backend/config/dataBase";
import { postSurveyService } from "@/Backend/services/SurveyService";
import { responseStatusCode } from "@/Backend/utils/responseHandler";
import translations from "@/Backend/utils/translate";
import { NextRequest, NextResponse } from "next/server";

// Create Survey
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const survey = await postSurveyService(body);
    return NextResponse.json(survey, { status: 201 });
  } catch (error) {
    const typeError = error as Error;
    return NextResponse.json(
      {
        statusCode: responseStatusCode.internal,
        message: typeError.message || translations.internalError,
      },
      { status: responseStatusCode.internal }
    );
  }
}
