import { z } from "zod";

export const acceptMessagesSchema = z.object({
  context: z
    .string()
    .min(10, { message: "Content must be at least of 10 characters" })
    .max(300, { message: "Content must not be longer than 300 characters" }),
});
