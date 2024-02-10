import { Sound, User } from "@prisma/client";
import { soundToCreate } from "../../api/sound/types.js";

// Define event names as enums
export enum SoundEvents {
  CreateMany = "soundCreateMany",
}

// Define types for event data associated with each entity
export type SoundData = {
  [SoundEvents.CreateMany]: {
    userId: number;
  };
};
