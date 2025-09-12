import { z } from "zod";

export const UserRegisterSchema = z.object({
  firstName: z.string().min(3).max(20),
  lastName: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["User", "Admin"]).default("User"),
  OTP: z.string().optional(),
});

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type UserRegisterType = z.infer<typeof UserRegisterSchema>;
export type UserLoginType = z.infer<typeof UserLoginSchema>;
