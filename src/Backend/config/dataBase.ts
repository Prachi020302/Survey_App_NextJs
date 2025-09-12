import mongoose from "mongoose";
import "dotenv/config";
import translations from "../utils/translate";

const connectDB = () =>
  mongoose
    .connect(`${process.env.MONGODB_URL}`)
    .then(() => console.log(translations.dbConnect))
    .catch((err) => console.log(`${translations.dbError} + ${err}`));

export default connectDB;
