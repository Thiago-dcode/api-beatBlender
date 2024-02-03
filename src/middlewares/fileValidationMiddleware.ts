import { NextFunction, Request, Response } from "express";
import imageType from "image-type";
import { ImageFileTypeError } from "../errors/type/type.js";
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
    const allowedFiles = ["png", "jpeg", "jpg"];
    const allowedMimeTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
    ];
    // Allowed file size in mb
    const maxSize = 5;

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
