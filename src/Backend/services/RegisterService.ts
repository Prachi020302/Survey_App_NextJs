import { User_Data } from "../model/UserModel";
import { responseStatusCode } from "../utils/responseHandler";
import { UserRegisterType } from "../validations/UserAuth";
import translations from "../utils/translate";
import bcrypt from "bcryptjs";

const RegisterService = async ({
  firstName,
  lastName,
  email,
  password,
  role,
}: UserRegisterType) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const userData = await User_Data.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashPassword,
    role: role,
  });

  try {
    if (userData) {
      return {
        statusCode: responseStatusCode.success,
        message: translations.registerSuccess,
        data: userData,
      };
    } else {
      return {
        statusCode: responseStatusCode.failure,
        message: translations.registerFail,
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

export default RegisterService;
