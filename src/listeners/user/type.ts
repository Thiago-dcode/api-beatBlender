import { User } from "@prisma/client";

// Define event names as enums
export enum UserEvents {
  Create = "userCreate",
}

// Define types for event data associated with each entity
export type UserData = {
  [UserEvents.Create]: {
    user: User;
  };
};
