import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { Request } from "express";
import { AuthorizationError } from "../errors/auth/auth.js";
import { EnvVarNotFoundError } from "../errors/general/general.js";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
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

export function getTokenFromHeaderOrError(req: Request) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) throw new AuthorizationError("Unauthenticated", {}, 401);

  return token;
}
export function getSecretJWTOrError() {
  const secretKey = env.get("JWT_KEY");
  if (!(typeof secretKey === "string"))
    throw new EnvVarNotFoundError("JWT_KEY env not found", {}, 500);

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
        throw new AuthorizationError("Token invalid", {});
      }

      payload = decoded;
    }
  );
  return payload;
}

export function randomString() {
  return uuidv4();
}

export function validateUserIdRequest(userId: number | undefined) {
  if (!userId)
    throw new AuthorizationError(
      "This user is not authorized to do this operations",
      {}
    );

  return userId;
}

export function bytesToMB(bytes: number) {
  return parseFloat((bytes / 1024 / 1024).toFixed(2));
}
export function sanitizeString(input: string) {
  // 1 Replace spaces with single spaces
  // 2 Replace spaces with dashes
  // 3 Remove any characters that are not alphanumeric or dashes
  return input
    .replace(/\s+/g, " ")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");
}

export function extractRoute(path: string): string {
  // Remove any trailing slashes
  path = path.replace(/\/+$/, "");

  // Split the path by "/"
  const parts = path.split("/");

  // Take the first two parts and join them back
  return "/" + (parts[1] || "");
}
export function getRandomValueFromArray<t>(array: t[]): t {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}
