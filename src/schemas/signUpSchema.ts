import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(4, "Username must be at least 4 characters")
  .max(20, "Username must not be more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username most not contain special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 6 characters" }),
});
