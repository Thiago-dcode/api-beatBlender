import { config } from "dotenv";
import bcrypt from "bcryptjs";
config();
export const env = {
    get: (key) => {
        return process.env[key];
    },
};
export async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}
export async function comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
}
