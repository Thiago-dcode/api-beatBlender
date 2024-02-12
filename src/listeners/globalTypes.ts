// Define event names as enums
export enum GlobalEvents {
  Success = "success",
  Error = "error",
}

// Define types for event data associated with each entity
export interface GlobalEventData {
  [GlobalEvents.Success]: boolean;
  [GlobalEvents.Error]: Error;
}
