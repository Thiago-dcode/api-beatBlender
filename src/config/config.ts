import { env } from "../utils/utils.js";

export default {
  S3Config: {
    credentials: {
      accessKeyId: env.get("S3_ACCESS_KEY"),
      secretAccessKey: env.get("S3_SECRET_ACCESS"),
    },
    region: env.get("S3_BUCKET_REGION"),
  },
};
