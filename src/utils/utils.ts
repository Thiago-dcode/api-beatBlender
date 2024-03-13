import bcrypt from "bcryptjs";
import { Request } from "express";
import { AuthorizationError } from "../errors/auth/auth.js";
import { EnvVarNotFoundError } from "../errors/general/general.js";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import appConfig from "../config/config.js";
import { config } from "dotenv";

config();
export const env = {
  get: (key: string): string => {
    const envar = process.env[key];
    if (!envar) {
      throw new EnvVarNotFoundError(
        "Environment variable: " + key + " not found",
        {},
        500
      );
    }
    return envar;
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
  secretKey: string,
  errorCode = 401
) {
  let payload: string | JwtPayload | undefined;
  JWT.verify(
    token,
    secretKey,
    (err: any, decoded: string | JwtPayload | undefined) => {
      if (err) {
        throw new AuthorizationError("Unauthenticated", {}, errorCode);
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
export function getRandomFreeDesign() {
  return getRandomValueFromArray(
    appConfig.design.free.designs.map((d) => d.name)
  );
}

export function getRandomUniqueFromArray<T>(
  arr: T[] | undefined,
  num: number
): T[] {
  if (!Array.isArray(arr) || arr.length === 0 || num <= 0 || isNaN(num)) {
    throw new Error(
      "Invalid input: 'arr' must be a non-empty array and 'num' must be a positive number"
    );
  }

  if (num > arr.length) {
    throw new Error("Number of elements to sample cannot exceed array length");
  }

  // Shuffle the array to ensure randomness
  const shuffledArr = arr.slice().sort(() => Math.random() - 0.5);

  // Select the first 'num' elements
  return shuffledArr.slice(0, num);
}
