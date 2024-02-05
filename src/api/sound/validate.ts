import { z } from "zod";

const Sound = z.object({
  folder: z
    .string()
    .refine((folder) => /^[a-zA-Z0-9-]+$/.test(folder), {
      message: "Folder must only contain letters, numbers, and '-'",
    })
    .optional(),
});

export const validateSound = (data: unknown) => {
  const result = Sound.safeParse(data);
  return result;
};
