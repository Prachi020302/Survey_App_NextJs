import bcrypt from "bcryptjs";
import { User_Data } from "../model/UserModel";
import { responseStatusCode } from "../utils/responseHandler";
import translations from "../utils/translate";

const ResetPassword = async (token: string, password: string) => {
  try {
    if (!token || !password) {
      return {
        message: "Token and password are required",
        statusCode: 400,
      };
    }

    const user = await User_Data.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return {
        message: "Invalid or expired token",
        statusCode: 400,
      };
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return {
      message: "Password reset successful",
      statusCode: 200,
    };
  } catch (error) {
    const typeError = error as Error;
    return {
      statusCode: responseStatusCode.internal,
      message: typeError.message || translations.internalError,
    };
  }
};

export default ResetPassword;
