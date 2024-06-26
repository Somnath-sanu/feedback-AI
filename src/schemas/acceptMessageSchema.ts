import { z } from "zod";

export const messageSchema = z.object({
  acceptMessages: z.boolean(),
});