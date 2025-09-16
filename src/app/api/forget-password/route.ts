import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/Backend/config/dataBase";
import ForgetPasswordService from "@/Backend/services/ForgetPassword";
import { responseStatusCode } from "@/Backend/utils/responseHandler";
import translations from "@/Backend/utils/translate";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { email } = await req.json();

    const token = await ForgetPasswordService(email);

    return NextResponse.json({ token: token.resetToken }, { status: 200 });
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
