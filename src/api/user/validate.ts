import { z } from "zod";

const User = z.object({
  name: z.string().min(3).optional(),
  username: z.string().min(5).toLowerCase(),
  password: z.string().min(8, {
    message: "Must contain at least 8 character(s)",
  }),
  email: z.string().email().optional(),
  biography: z.string().optional(),
  avatar: z.string().optional(),
  isAdmin: z.boolean().default(false).optional(),
});

export const validateCreate = (data: unknown) => {
  const result = User.safeParse(data);
  return result;
};

export const validateUpdate = (data: unknown) => {
  return User.partial().safeParse(data);
};
