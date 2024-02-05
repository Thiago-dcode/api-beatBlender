import soundRoutes from "./soundRoutes.js";
import StorageService from "../../services/logger/storage/storage.js";
import SoundRepository from "./soundRepository.js";
import { S3Client } from "@aws-sdk/client-s3";
import { env } from "../../utils/utils.js";
import ResizeService from "../../services/resize/resize.js";
import { db } from "../../db/db.js";
import config from "../../config/config.js";

import SoundHandler from "./soundHandler.js";
import SoundService from "./soundService.js";
const storageService = new StorageService(
  new S3Client(config.S3Config),
  env.get("S3_BUCKET_NAME"),
  env.get("S3_BUCKET_REGION"),
  new ResizeService()
);
const soundRepo = new SoundRepository(db());
const soundService = new SoundService(soundRepo, storageService);
const soundHandler = new SoundHandler(soundService);

export default soundRoutes(soundHandler);
