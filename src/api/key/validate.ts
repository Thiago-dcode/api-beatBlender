import { z } from "zod";

const Key = z.object({
  key: z.string(),
  displayName: z.string().max(6).optional(),
  soundId: z.coerce.number().int().optional(),
  bgColor: z.string().optional(),
  name: z.string().max(10).optional(),
  keyColor: z.string().optional(),
  category: z.string().optional(),
  order: z.coerce.number().int().optional(),
});

export const validateKey = (data: unknown) => {
  const result = Key.safeParse(data);
  return result;
};
export const validateKeyOptional = (data: unknown) => {
  const result = Key.partial().safeParse(data);
  return result;
};
