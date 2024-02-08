import { CustomError } from "../../errors/CustomError.js";

interface PathSegments {
  filename: string;
  foldername: string;
}

export function extractFolderAndFileName(path: string): PathSegments {
  const segments = path.split("/");
  const filename = segments.pop() || ""; // Remove and return the last segment
  const foldername = segments.pop() || ""; // Remove and return the second-to-last segment (folder name)
  if (!filename || !foldername)
    throw new CustomError(
      "Error in: extractFolderAndFileName(), should return a filename and a foldername",
      {},
      500
    );

  return { filename, foldername };
}
