import { Keyboard } from "@prisma/client";
import { GlobalEventData } from "../globalTypes.js";

// Define event names as enums
export enum KeyboardEvents {
  Success = "success",
  Error = "error",

  Create = "onCreate",
  Update = "onUpdate",
  Delete = "onDelete",
}

// Define types for event data associated with each entity
interface _KeyboardEventData {
  [KeyboardEvents.Create]: {
    userId: number;
    keyboard: Keyboard;
  };
  [KeyboardEvents.Update]: {
    userId: number;
    keyboard: Keyboard;
  };
  [KeyboardEvents.Delete]: {
    userId: number;
    keyboardDeleted: Keyboard;
  };

  [KeyboardEvents.Success]: boolean;
  [KeyboardEvents.Error]: Error;
}

export interface KeyboardEventData
  extends _KeyboardEventData,
    GlobalEventData {}
