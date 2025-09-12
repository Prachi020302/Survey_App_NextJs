import connectDB from "@/Backend/config/dataBase";
import {
  getSurveyService,
  updateSurveyStatusService,
} from "@/Backend/services/SurveyService";
import { responseStatusCode } from "@/Backend/utils/responseHandler";
import translations from "@/Backend/utils/translate";
import { NextResponse } from "next/server";

// Get all surveys
export async function GET() {
  try {
    await connectDB();
    const surveys = await getSurveyService();
    return NextResponse.json(surveys);
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

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, isActive } = await req.json();

    const survey = await updateSurveyStatusService(id, isActive);

    return NextResponse.json(survey);
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
