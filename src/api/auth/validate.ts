import { z } from "zod";

const User = z.object({
  username: z.string().toLowerCase(),
  password: z.string(),
});

export const validateLoggin = (data: unknown) => {
  const result = User.safeParse(data);
  return result;
};
