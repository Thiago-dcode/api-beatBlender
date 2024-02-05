import { z } from "zod";

const User = z.object({
  folder: z.string().optional()

});

export const validateSound = (data: unknown) => {
  const result = User.safeParse(data);
  return result;
};
