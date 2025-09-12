import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/Backend/config/dataBase";
import { LoginService } from "@/Backend/services/LoginService";
import { responseStatusCode } from "@/Backend/utils/responseHandler";
import translations from "@/Backend/utils/translate";
import { cookies } from "next/headers";
import { getCurrentUserService } from "@/Backend/services/UserService";

export const POST = async (req: NextRequest) => {
  await connectDB();
  const { email, password } = await req.json();

  let isValid = true;
  if (!email) {
    isValid = false;
    return NextResponse.json(
      {
        statusCode: responseStatusCode.unProcess,
        message: translations.emailRequired,
      },
      { status: responseStatusCode.unProcess }
    );
  } else {
    try {
      if (isValid) {
        const userdata = await LoginService({ email, password });

        if (userdata) {
          
          if (userdata.statusCode === responseStatusCode.success) {
            if ("token" in userdata && typeof userdata.token === "string") {
              (await cookies()).set("Userdata", userdata.token);

              const responsePayload = {
                statusCode: responseStatusCode.success,
                message: userdata.message,
                token: userdata.token,
                id: userdata.data.id,
                email: userdata.data.email,
                role: userdata.data.role,
              };
              

              return NextResponse.json(
                responsePayload,
                { status: responseStatusCode.success }
              );
            }
          } else {
            return NextResponse.json(
              {
                statusCode: userdata.statusCode,
                message: userdata.message,
              },
              { status: userdata.statusCode }
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

export async function GET() {
  try {
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("Userdata")?.value;
    
    const user = await getCurrentUserService(token) as { id: string; email: string; role: string } | null;

    if (!user) {
      return NextResponse.json(
        { statusCode: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Return id, email and role
    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch {
    return NextResponse.json(
      { statusCode: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
