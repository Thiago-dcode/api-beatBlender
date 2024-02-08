import { extractFolderAndFileName as extractFunction } from "../sound/helper.js";

export const extractFolderAndFileName = (path: string) => {
  return extractFunction(path);
};
