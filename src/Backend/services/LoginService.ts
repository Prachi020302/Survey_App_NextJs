import { User_Data } from "../model/UserModel";
import { UserLoginType } from "../validations/UserAuth";
import { responseStatusCode } from "../utils/responseHandler";
import translations from "../utils/translate";
import { jwtToken } from "../utils/JwtToken";
import bcrypt from "bcryptjs";

export const LoginService = async ({ email, password }: UserLoginType) => {
  const userData = await User_Data.findOne({
    email: email,
  });

  try {
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        const data = {
          id: userData.id,
          email: userData.email,
          role: userData.role,
        };
        const token = await jwtToken(data);
        return {
          data: data,
          statusCode: responseStatusCode.success,
          message: translations.loginSuccess,
          token: token,
        };
      } else {
        return {
          statusCode: responseStatusCode.notFound,
          message: translations.passwordNotMatch,
        };
      }
    } else {
      return {
        statusCode: responseStatusCode.notFound,
        message: translations.userNotFound,
      };
    }
  } catch (error) {
    const typeError = error as Error;
    return {
      statusCode: responseStatusCode.internal,
      message: typeError.message || translations.internalError,
    };
  }
};
