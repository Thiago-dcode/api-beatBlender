import { z } from "zod";

const Key = z.object({
  key: z.string(),
  displayName: z.string(),
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
