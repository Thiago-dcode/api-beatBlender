import { Sound} from "@prisma/client";
import { GlobalEventData } from "../globalTypes.js";

// Define event names as enums
export enum SoundFolderEvents {
  UpdateStorage = "updateStorage",
  DeleteStorage = "deleteStorage",

  Delete = "onDelete",
}

// Define types for event data associated with each entity
 type _SoundFolderData = {
  [SoundFolderEvents.UpdateStorage]: {
    sounds: Sound[];
    userId: number;
    foldername: string;
  };
  [SoundFolderEvents.DeleteStorage]: {
    userId: number;
  };
  [SoundFolderEvents.Delete]: {
    userId: number;
  };
};
export interface SoundFolderData extends _SoundFolderData, GlobalEventData {}
