import { uuid } from "uuidv4";
import { env } from "../utils/utils.js";

export default {
  S3Config: {
    credentials: {
      accessKeyId: env.get("S3_ACCESS_KEY"),
      secretAccessKey: env.get("S3_SECRET_ACCESS"),
    },
    region: env.get("S3_BUCKET_REGION"),
  },
  image: {
    maxSize: 5,
    allowedFiles: ["png", "jpeg", "jpg"],
    allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  },
  sound: {
    maxSize: 5,
    allowedMimeTypes: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"],
  },
  JWT: {
    expire: "1h",
    refreshExpire: "3h",
  },
  membership: {
    free: {
      id: 1,
      name: "free",
    },
  },
  routes: {
    users: "/users",
    auth: "/auth",
    sounds: "/sounds",
    ["sounds-folder"]: "/sounds-folder",
    keys: "/keys",
    keyboards: "/keyboards",
    ["user-info"]: "/user-info",
  },
  user: {
    free: {
      username: "free-beatblender",
      id: 1,
    },
  },
  design: {
    free: {
      path: "free/designs",
      names: ["classic", "classic-1"],
    },
    premium: {
      path: "premium/designs",
    },
  },

  effects: [
    {
      name: "volume",
      description: "Modify the volume",
      keys: true,
      keyboards: true,
      isPremium: false,
      isActive: true,
      config: {
        level: 1,
      },
    },
    {
      name: "loop",
      description:
        "Play a audio in a loop. By default the audio will start again after it ends, you can set a specific BPM",
      keys: true,
      isActive: false,
      keyboards: false,
      isPremium: false,
      config: {
        bpm: 0,
      },
    },
  ],
};
