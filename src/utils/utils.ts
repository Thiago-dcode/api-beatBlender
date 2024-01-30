import { config } from "dotenv";
import bcrypt from "bcryptjs";
config();
export const env = {
  get: (key: string): any => {
    return process.env[key];
  },
};
export async function hashPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}
export async function comparePassword(plaintextPassword: string, hash: string) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}
