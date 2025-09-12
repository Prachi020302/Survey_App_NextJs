import { User_Data } from "../model/UserModel";
import { responseStatusCode } from "../utils/responseHandler";
import translations from "../utils/translate";
import crypto from "crypto";

const forgetPassword = async (email: string) => {
  try {
    const user = await User_Data.findOne({ email });
    if (!user) {
      throw new Error(translations.userNotFound);
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    return {
      statusCode: 200,
      resetToken: token,
    };
  } catch (error) {
    const typeError = error as Error;
    return {
      statusCode: responseStatusCode.internal,
      message: typeError.message || translations.internalError,
    };
  }
};

export default forgetPassword;
