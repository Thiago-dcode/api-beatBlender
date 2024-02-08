import { Sound, Sound_folder } from "@prisma/client";

// Define event names as enums
export enum SoundFolderEvents {
  UpdateStorage = "updateStorage",
}

// Define types for event data associated with each entity
export type SoundFolderData = {
  [SoundFolderEvents.UpdateStorage]: {
    sounds: Sound[];
    userId: number;
    foldername: string;
  };
};
