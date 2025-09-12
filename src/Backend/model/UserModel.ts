import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  otp: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema = new mongoose.Schema<UserInterface>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "firstName is required"],
      minlength: [3, "firstName must be at least 3 characters long"],
      maxlength: [20, "firstName must be at most 20 characters long"],
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
      minlength: [3, "lastName must be at least 3 characters long"],
      maxlength: [20, "lastName must be at most 20 characters long"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      validate: {
        validator: (v: string) =>
          /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    role: {
      type: String,
      required: [true, "role is required"],
      default: "User",
      enum: ["User", "Admin"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    otp: {
      type: String,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

const User_Data =
  mongoose.models.User_Data || mongoose.model("User_Data", UserSchema);

export { User_Data };
