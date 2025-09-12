import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/Backend/config/dataBase";
import RegisterService from "@/Backend/services/RegisterService";
import { responseStatusCode } from "@/Backend/utils/responseHandler";
import translations from "@/Backend/utils/translate";

export const POST = async (req: NextRequest) => {
  await connectDB();
  const { firstName, lastName, email, password, role } = await req.json();

  let count = true;
  if (!firstName) {
    count = false;
    return NextResponse.json(
      {
        statusCode: responseStatusCode.unProcess,
        message: translations.firstNameRequired,
      },
      { status: responseStatusCode.unProcess }
    );
  }
  if (!lastName) {
    count = false;
    return NextResponse.json(
      {
        statusCode: responseStatusCode.unProcess,
        message: translations.lastNameRequired,
      },
      { status: responseStatusCode.unProcess }
    );
  }
  if (!email) {
    count = false;
    return NextResponse.json(
      {
        statusCode: responseStatusCode.unProcess,
        message: translations.emailRequired,
      },
      { status: responseStatusCode.unProcess }
    );
  } else {
    try {
      if (count === true) {
        const userdata = await RegisterService({
          firstName,
          lastName,
          email,
          password,
          role,
        });

        if (userdata) {
          return NextResponse.json(
            {
              statusCode: userdata.statusCode,
              message: userdata.message,
            },
            { status: userdata.statusCode }
          );
        } else {
          return NextResponse.json(
            {
              statusCode: responseStatusCode.failure,
              message: translations.registerFail,
            },
            { status: responseStatusCode.failure }
          );
        }
      } else {
        return NextResponse.json(
          {
            statusCode: responseStatusCode.unProcess,
            error: translations.fillDetails,
          },
          { status: responseStatusCode.unProcess }
        );
      }
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
};
