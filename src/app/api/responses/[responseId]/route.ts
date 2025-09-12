import connectDB from "@/Backend/config/dataBase";
import { getResponseByIdService } from "@/Backend/services/ResponseService";
import { responseStatusCode } from "@/Backend/utils/responseHandler";
import translations from "@/Backend/utils/translate";
import { NextResponse } from "next/server";

// Get single response by ID
export async function GET(params: { responseId: string }) {
  try {
    await connectDB();
    const { responseId } = params;

    const response = await getResponseByIdService(responseId);

    if (response?.statusCode === responseStatusCode.success) {
      return NextResponse.json(response, {
        status: responseStatusCode.success,
      });
    }

    return NextResponse.json(response);
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
