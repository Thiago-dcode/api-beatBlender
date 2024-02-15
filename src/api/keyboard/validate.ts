import { z } from "zod";

const Key = z.object({
  name: z.string().refine((name) => /^[a-zA-Z0-9-. ]+$/.test(name), {
    message: "Name must only contain letters, numbers, and '-'"
  }),
  keys: z.number().array().optional(),
  keysToDelete:z.number().array().optional(),
  categoriesToDelete:z.string().array().optional(),
  categories: z.string().array().optional(),
  design_keyId: z.coerce.number().int().optional(),
});

export const validateKeyboard = (data: unknown) => {
  const result = Key.safeParse(data);
  return result;
};
export const validateKeyboardOptional = (data: unknown) => {
  const result = Key.partial().safeParse(data);
  return result;
};
