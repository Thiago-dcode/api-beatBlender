import { Sound } from "@prisma/client";
import { GlobalEventData } from "../globalTypes.js";

// Define event names as enums
export enum SoundEvents {
  Success = "success",
  Error = "error",
  CreateMany = "onCreateMany",
  Update = "onUpdate",
  Delete = "onDelete",
}

// Define types for event data associated with each entity
interface _SoundEventData {
  [SoundEvents.CreateMany]: {
    userId: number;
  };
  [SoundEvents.Update]: {
    userId: number;
    sound: Sound;
  };
  [SoundEvents.Delete]: {
    userId: number;
    soundDeleted: Sound;
  };

  [SoundEvents.Success]: boolean;
  [SoundEvents.Error]: Error;
}

export interface SoundEventData extends _SoundEventData, GlobalEventData {}
