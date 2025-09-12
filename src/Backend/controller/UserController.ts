import { NextResponse } from "next/server";
import { getUserByIdService, getUserService } from "../services/UserService";
import { responseStatusCode } from "../utils/responseHandler";
import translations from "../utils/translate";

const GetUser = async () => {
  try {
    const userList = await getUserService();
    return NextResponse.json({
      statusCode: responseStatusCode.success,
      userList,
    });
  } catch (error) {
    const typeError = error as Error;
    return NextResponse.json({
      statusCode: responseStatusCode.internal,
      message: typeError.message || translations.internalError,
    });
  }
};

const GetUserById = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  try {
    const userList = await getUserByIdService(id);
    if (userList) {
      return NextResponse.json({
        statusCode: responseStatusCode.success,
        userList,
      });
    } else {
      return NextResponse.json({
        statusCode: responseStatusCode.failure,
        message: translations.userNotFound,
      });
    }
  } catch (error) {
    const typeError = error as Error;
    return NextResponse.json({
      statusCode: responseStatusCode.internal,
      message: typeError.message || translations.internalError,
    });
  }
};

export { GetUser, GetUserById };
