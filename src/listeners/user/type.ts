import { User } from "@prisma/client";

// Define event names as enums
export enum UserEvents {
  Create = "userCreate",
  Delete = "delete",
  SuccessCreate = "successCreate",
  Error = "error",
}

// Define types for event data associated with each entity
export type UserData = {
  [UserEvents.Create]: {
    user: User;
  };
  [UserEvents.Delete]: {
    user: User;
  };
  [UserEvents.SuccessCreate]: boolean;
  [UserEvents.Error]: Error;
};
