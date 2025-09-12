import connectDB from "@/Backend/config/dataBase";
import {
  getSurveyByIdService,
  deleteSurveyService,
} from "@/Backend/services/SurveyService";
import { responseStatusCode } from "@/Backend/utils/responseHandler";
import translations from "@/Backend/utils/translate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const result = await getSurveyByIdService(id);

    if (result.statusCode === responseStatusCode.notFound) {
      return NextResponse.json(
        {
          statusCode: result.statusCode,
          message: result.message,
        },
        { status: result.statusCode }
      );
    }

    return NextResponse.json(result);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const result = await deleteSurveyService(id);

    if (result.statusCode === responseStatusCode.notFound) {
      return NextResponse.json(
        {
          statusCode: result.statusCode,
          message: result.message,
        },
        { status: result.statusCode }
      );
    }

    return NextResponse.json(result);
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
