import { z } from "zod";

const SoundFolder = z.object({
  name: z.string().refine((name) => /^[a-zA-Z0-9-]+$/.test(name), {
    message: "Name must only contain letters, numbers, and '-'",
  }),
  userId: z.coerce.number().int(),
  isDefault: z.boolean().default(false).optional(),
});

export const validateSoundFolder = (data: unknown) => {
  const result = SoundFolder.safeParse(data);
  return result;
};
