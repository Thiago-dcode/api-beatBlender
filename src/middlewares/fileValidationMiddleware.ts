import { NextFunction, Request, Response } from "express";
import imageType from "image-type";
import { ImageFileTypeError, AudioFileTypeError } from "../errors/type/type.js";
import config from "../config/config.js";
import { EntityNotFoundError } from "../errors/db/db.js";

export const imageValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const image = req.file;
    if (!image) return next();
    const img = await imageType(image.buffer);
    if (!img)
      throw new ImageFileTypeError("The file must be an image", {
        [image.fieldname]: "Must be an image",
      });
    const { ext, mime } = img;
    const { maxSize, allowedFiles, allowedMimeTypes } = config.image;

    // Allowed file size in mb

    // Check if the uploaded file is allowed
    if (!allowedFiles.includes(ext) || !allowedMimeTypes.includes(mime)) {
      throw new ImageFileTypeError("Invalid file", {
        [image.fieldname]: "Must be an image",
      });
    }

    if (image.size / (1024 * 1024) > maxSize) {
      throw new ImageFileTypeError("File too large", {
        [image.fieldname]: "Exceed max file size of " + maxSize + " mb",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const audioValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const audiosFiles = req.files as Express.Multer.File[];
    const audioFile = req.file as Express.Multer.File;

    if ((!audioFile && req.method === "PATCH") || req.path !== "/sounds") {
      return next();
    }
    console.log("audiosFiles", audiosFiles);
    if ((!audiosFiles || audiosFiles.length < 1) && !audioFile) {
      throw new AudioFileTypeError("Audio field is required", {
        sounds: "Required",
      });
    }

    let audios: Express.Multer.File[] = [];
    if (audiosFiles?.length > 0) audios = [...audiosFiles];
    if (audioFile) audios.push(audioFile);
    const { maxSize, allowedMimeTypes } = config.sound;
    for (const audio of audios) {
      if (!allowedMimeTypes.includes(audio.mimetype)) {
        throw new AudioFileTypeError("Invalid file", {
          [audio.fieldname]: "Must be a audio file",
        });
      }

      if (audio.size / (1024 * 1024) > maxSize) {
        throw new AudioFileTypeError("File too large", {
          [audio.fieldname]: "Exceed max file size of " + maxSize + " mb",
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
