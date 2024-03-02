import { User } from "@prisma/client";

export interface CreateUser {
  username: string;
  password: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface UpdateUser {
  username?: string;
  email?: string;
  name?: string;
  biography?: string;
  password?: string;
  avatar?: string;
  updatedAt?: Date;
}
export interface whereUnique {
  id?: number;
  username?: string;
  email?: string;
}
export interface Include {
  user_info?: boolean;
  sounds?: boolean;
  records?: boolean;
  keyboards?: boolean;
  sounds_folder?: boolean;
  keys?: boolean;
}
export interface UserWithAvatarUrl extends User {
  avatarUrl: string;
}