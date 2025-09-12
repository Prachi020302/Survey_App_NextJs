import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/Backend/config/dataBase";
import { User_Data } from "@/Backend/model/UserModel";
import crypto from "crypto";

export const POST = async (req: NextRequest) => {
  await connectDB();
  const { email } = await req.json();

  const user = await User_Data.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // In production, send email. Here, return token for demo.
  return NextResponse.json({ token }, { status: 200 });
};
