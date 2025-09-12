import jwt from "jsonwebtoken";
import "dotenv/config";
import translations from "./translate";

const jwtToken = async (data: any) => {
  return jwt.sign(data, `${process.env.JWT_SECRET}`, {
    expiresIn: "1h",
  });
};

const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
    return decoded;
  } catch (error) {
    throw new Error(translations.InvalidToken);
  }
};
export { jwtToken, verifyToken };
