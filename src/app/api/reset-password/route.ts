import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/Backend/config/dataBase";
import { User_Data } from "@/Backend/model/UserModel";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  await connectDB();
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json(
      { message: "Token and password are required" },
      { status: 400 }
    );
  }

  const user = await User_Data.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return NextResponse.json(
    { message: "Password reset successful" },
    { status: 200 }
  );
};
