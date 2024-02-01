import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { AuthorizationError } from "../errors/auth/auth.js";
import { EnvVarNotFoundError } from "../errors/general/general.js";
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
export function getTokenFromHeader(req) {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token)
        throw new AuthorizationError("Unauthenticated", 401);
    return token;
}
export function getSecretJWT() {
    const secretKey = env.get("JWT_KEY");
    if (!(typeof secretKey === "string"))
        throw new EnvVarNotFoundError("JWT_KEY env not found", 500);
    return secretKey;
}
export function getJWTpayLoadOrError(JWT, token, secretKey) {
    let payload;
    JWT.verify(token, secretKey, (err, decoded) => {
        if (err) {
            throw new AuthorizationError("Forbidden");
        }
        payload = decoded;
    });
    return payload;
}
