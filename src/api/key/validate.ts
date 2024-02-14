import { z } from "zod";

const Key = z.object({
  letter: z
    .string()
    .length(1)
    .refine((name) => /^[a-zA-Z0-9]+$/.test(name), {
      message: "Letter must only a number or a letter",
    }),
  soundId: z.coerce.number().int().optional(),
  design_keyId: z.coerce.number().int().optional(),
});

export const validateKey = (data: unknown) => {
  const result = Key.safeParse(data);
  return result;
};
export const validateKeyOptional = (data: unknown) => {
  const result = Key.partial().safeParse(data);
  return result;
};
