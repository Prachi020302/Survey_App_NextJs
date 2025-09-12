import { User_Data } from "../model/UserModel";

const forgetPassword = async (email: string) => {
  // Logic for forgetting password
  // 1. Validate email
  // 2. Generate reset token
  // 3. Send email with reset link

  // Implementation here
  try {
    // 1. Validate email
    const user = await User_Data.findOne({ email });
    if (!user) throw new Error("User not found");

    // 2. Generate reset token
    const resetToken = user.generateResetToken();

    // 3. Send email with reset link
    await sendEmail({
      to: email,
      subject: "Password Reset",
      text: `Reset your password using this link: ${resetToken}`,
    });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
  }
};

export default forgetPassword;
