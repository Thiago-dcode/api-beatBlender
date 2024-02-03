import userRoute from "./userRoutes.js";
import UserRepository from "./userRepository.js";
import { db } from "../../db/db.js";
import UserService from "./userService.js";
import UserHandler from "./userHandler.js";
import StorageService from "../../services/logger/storage/storage.js";
import { env } from "../../utils/utils.js";
import { S3Client } from "@aws-sdk/client-s3";
const storageService = new StorageService(
  new S3Client({
    credentials: {
      accessKeyId: env.get("S3_ACCESS_KEY"),
      secretAccessKey: env.get("S3_SECRET_ACCESS"),
    },
    region: env.get("S3_BUCKET_REGION"),
  }),
  env.get("S3_BUCKET_NAME"),
  env.get("S3_BUCKET_REGION")
);
const user = new UserRepository(db());
const userService = new UserService(user, storageService);
const userHandler = new UserHandler(userService);
export default userRoute(userHandler);
