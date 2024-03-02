import { NextFunction, Request, Response } from "express";
import { Language, User } from "../custom.js";

// to make the file a module and avoid the TypeScript error
export type Fit = "cover" | "contain" | "fill" | "inside" | "outside";
export type S3File = { key: string; body: Buffer; contentType: string };
