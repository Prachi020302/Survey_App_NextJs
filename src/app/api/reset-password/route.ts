import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/Backend/config/dataBase";
import { responseStatusCode } from "@/Backend/utils/responseHandler";
import translations from "@/Backend/utils/translate";
import ResetPassword from "@/Backend/services/ResetPassword";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { token, password } = await req.json();

    const result = await ResetPassword(token, password);
    return NextResponse.json({
      message: result.message,
      status: result.statusCode,
    });
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
};
