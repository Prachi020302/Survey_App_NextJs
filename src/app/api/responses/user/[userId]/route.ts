import connectDB from "@/Backend/config/dataBase";
import { getResponseByUserIdService } from "@/Backend/services/ResponseService";
import { responseStatusCode } from "@/Backend/utils/responseHandler";
import translations from "@/Backend/utils/translate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();
    const { userId } = await context.params;

    const result = await getResponseByUserIdService(userId);
    
    if (result.statusCode === responseStatusCode.notFound) {
      return NextResponse.json(
        {
          statusCode: result.statusCode,
          message: result.message,
          data: [],
          count: 0,
        },
        { status: 200 } // Return 200 with empty array instead of 404
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
