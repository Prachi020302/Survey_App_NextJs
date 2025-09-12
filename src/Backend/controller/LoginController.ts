import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LoginService } from "../services/LoginService";
import { responseStatusCode } from "../utils/responseHandler";
import translations from "../utils/translate";

const LoginController = async (req: NextRequest) => {
  const { Username, Password } = await req.json();

  let isValid = true;
  if (!Username) {
    isValid = false;
    return NextResponse.json({
      statusCode: responseStatusCode.unProcess,
      message: translations.usernameRequired,
    });
  }
  if (!Password) {
    isValid = false;
    return NextResponse.json({
      statusCode: responseStatusCode.unProcess,
      message: translations.passwordRequired,
    });
  } else {
    try {
      if (isValid) {
        const userdata = await LoginService({ Username, Password });

        if (userdata) {
          if (userdata.statusCode === responseStatusCode.success) {
            if (typeof userdata.token === "string") {
              (await cookies()).set("Userdata", userdata.token);
            } else {
              (await cookies()).set("Userdata", "");
            }
            return NextResponse.json({
              statusCode: responseStatusCode.success,
              message: userdata.message,
              token: userdata.token,
            });
          } else {
            return NextResponse.json({
              statusCode: userdata.statusCode,
              message: userdata.message,
            });
          }
        } else {
          return NextResponse.json({
            statusCode: responseStatusCode.unProcess,
            error: translations.fillDetails,
          });
        }
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

export { LoginController };
