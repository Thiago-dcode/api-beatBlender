import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { Request } from "express";
import { AuthorizationError } from "../errors/auth/auth.js";
import { EnvVarNotFoundError } from "../errors/general/general.js";
import { JwtPayload } from "jsonwebtoken";
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

export function getTokenFromHeader(req: Request) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) throw new AuthorizationError("Unauthenticated", 401);

  return token;
}
export function getSecretJWT() {
  const secretKey = env.get("JWT_KEY");
  if (!(typeof secretKey === "string"))
    throw new EnvVarNotFoundError("JWT_KEY env not found", 500);

  return secretKey;
}
export function getJWTpayLoadOrError(
  JWT: JwtPayload,
  token: string,
  secretKey: string
) {
  let payload: string | JwtPayload | undefined;
  JWT.verify(
    token,
    secretKey,
    (err: any, decoded: string | JwtPayload | undefined) => {
      if (err) {
        throw new AuthorizationError("Forbidden");
      }

      payload = decoded;
    }
  );
  return payload;
}
