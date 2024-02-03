import multer from "multer";

export default {
  memory: multer({ storage: multer.memoryStorage() }),
  disk: (options: multer.DiskStorageOptions) => {
    return multer({
      storage: multer.diskStorage(options),
    });
  },
};
