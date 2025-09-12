import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { responseStatusCode } from "@/Backend/utils/responseHandler";
import translations from "@/Backend/utils/translate";

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("Userdata");
  if (!token) {
    return NextResponse.json({
      statusCode: responseStatusCode.tokenProvide,
      message: translations.unauthorized,
    });
  } else {
    try {
      const decode = jwtDecode<{ role: string }>(token.value);
      const Role = decode.role;

      if (req.nextUrl.pathname.startsWith("/dashboard")) {
        if (Role !== "admin") {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }
      if (req.nextUrl.pathname.startsWith("/surveys")) {
        if (Role !== "user") {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      } else {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }
};

export const config = {
  matchers: ["/login", "/register", "/dashboard", "/surveys"],
};
