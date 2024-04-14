import { NextFunction, Request, Response } from "express";
import { Language, User } from "../custom.js";
import { Sound } from "@prisma/client";

// to make the file a module and avoid the TypeScript error
export type Fit = "cover" | "contain" | "fill" | "inside" | "outside";
export type S3File = { key: string; body: Buffer; contentType: string };
export type FreeResourceObj = { [key: string]: _Object[] }
interface SoundWithSoundFolder extends Sound {
    Sound_folder: Sound_folder;
  }
  type SoundWithSoundFolderOrUndefinedArray = (
    | SoundWithSoundFolder
    | undefined
  )[];