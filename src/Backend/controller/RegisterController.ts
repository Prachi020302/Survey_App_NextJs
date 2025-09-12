import { NextRequest, NextResponse } from "next/server";
import RegisterService from "../services/RegisterService";
import { responseStatusCode } from "../utils/responseHandler";
import translations from "../utils/translate";

const RegisterController = async (req: NextRequest) => {
  const { firstName, lastName, email, password, role } = await req.json();

  let count = true;
  if (!firstName) {
    count = false;
    return NextResponse.json({
      statusCode: responseStatusCode.unProcess,
      message: translations.firstNameRequired,
    });
  }
  if (!lastName) {
    count = false;
    return NextResponse.json({
      statusCode: responseStatusCode.unProcess,
      message: translations.lastNameRequired,
    });
  }
  if (!email) {
    count = false;
    return NextResponse.json({
      statusCode: responseStatusCode.unProcess,
      message: translations.emailRequired,
    });
  }
  if (!password) {
    count = false;
    return NextResponse.json({
      statusCode: responseStatusCode.unProcess,
      message: translations.passwordRequired,
    });
  }
  if (!role) {
    count = false;
    return NextResponse.json({
      statusCode: responseStatusCode.unProcess,
      message: translations.roleRequired,
    });
  } else {
    try {
      if (count === true) {
        const userdata = await RegisterService({ firstName, lastName, email, password, role });

        if (userdata) {
          return NextResponse.json({
            statusCode: userdata.statusCode,
            message: userdata.message,
          });
        } else {
          return NextResponse.json({
            statusCode: responseStatusCode.failure,
            message: translations.registerFail,
          });
        }
      } else {
        return NextResponse.json({
          statusCode: responseStatusCode.unProcess,
          error: translations.fillDetails,
        });
      }
    } catch (error) {
      const typeError = error as Error;
      return NextResponse.json({
        statusCode: responseStatusCode.internal,
        message: typeError.message || translations.internalError,
      });
    }
  }
};

export { RegisterController };
