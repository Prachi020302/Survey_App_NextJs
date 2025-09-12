import connectDB from "@/Backend/config/dataBase";
import {
  getResponseService,
  createResponseService,
} from "@/Backend/services/ResponseService";
import { responseStatusCode } from "@/Backend/utils/responseHandler";
import translations from "@/Backend/utils/translate";
import { NextRequest, NextResponse } from "next/server";

// Get all responses
export async function GET() {
  try {
    await connectDB();
    const responses = await getResponseService();
    return NextResponse.json(responses);
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

// Create new response
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const responseData = await request.json();
    
    const result = await createResponseService(responseData);
    
    if (result?.statusCode === responseStatusCode.success) {
      return NextResponse.json(result, { status: responseStatusCode.success });
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
