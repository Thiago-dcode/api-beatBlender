import { NextFunction, Request, Response } from "express";
import imageType from "image-type";
import { ImageFileTypeError, AudioFileTypeError } from "../errors/type/type.js";
import config from "../config/config.js";

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
    const audios = req.files as Express.Multer.File[];
    if (audios.length === 0) {
      throw new AudioFileTypeError("Sound field missing", {
        sound: "The sound field is required",
      });
    }
    const { maxSize, allowedMimeTypes } = config.sound;
    for (const audio of audios) {
      if (!allowedMimeTypes.includes(audio.mimetype)) {
        throw new ImageFileTypeError("Invalid file", {
          [audio.fieldname]: "Must be a audio file",
        });
      }

      if (audio.size / (1024 * 1024) > maxSize) {
        throw new ImageFileTypeError("File too large", {
          [audio.fieldname]: "Exceed max file size of " + maxSize + " mb",
        });
      }

 
     
    }

    next();
  } catch (error) {
    next(error);
  }
};
