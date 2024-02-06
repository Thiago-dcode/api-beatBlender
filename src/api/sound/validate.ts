import { z } from "zod";

const Sound = z.object({
  name: z
    .string()
    .refine((name) => /^[a-zA-Z0-9-]+$/.test(name), {
      message: "Name must only contain letters, numbers, and '-'",
    })
    .optional(),
  userId: z.coerce.number().int(),
  sound_folderId: z.coerce.number().int().optional(),
});

export const validateSound = (data: unknown) => {
  const result = Sound.safeParse(data);
  return result;
};
