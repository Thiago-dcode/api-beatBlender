import { z } from "zod";

const Sound = z.object({
  folder: z
    .string()
    .refine((folder) => /^[a-zA-Z0-9-]+$/.test(folder), {
      message: "Folder must only contain letters, numbers, and '-'",
    })
    .optional(),
  name: z
    .string()
    .refine((name) => /^[a-zA-Z0-9-]+$/.test(name), {
      message: "Name must only contain letters, numbers, and '-'",
    })
    .optional(),
  userId: z.coerce.number().int()
});

export const validateSound = (data: unknown) => {
  const result = Sound.safeParse(data);
  return result;
};
