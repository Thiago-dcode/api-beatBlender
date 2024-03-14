import { env } from "process";
import { config } from "dotenv";
config();
export default {
  S3Config: {
    credentials: {
      accessKeyId: env["S3_ACCESS_KEY"] || "",
      secretAccessKey: env["S3_SECRET_ACCESS"] || "",
    },
    region: env["S3_BUCKET_REGION"] || "",
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
    expire: "30sec",
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

      designs: [
        {
          name: "classic",
          colors: ["rgb(38 38 38)", "rgb(245 245 245)"],
        },
        {
          name: "classic-1",
          colors: ["rgb(38 38 38)", "rgb(245 245 245)"],
        },
        {
          name: "minimal",
          colors: ["rgb(38 38 38)", "rgb(245 245 245)"],
        },
        {
          name: "minimal-1",
          colors: ["rgb(38 38 38)", "rgb(245 245 245)"],
        },
        {
          name: "beat-blender",
          colors: ["#4fbc9c", "#efdc75"],
        },
        {
          name: "beat-blender-1",
          colors: ["#4fbc9c", "#efdc75"],
        },
      ],
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
      config: {
        bpm: 0,
      },
    },
  ],
};
