export interface CreateUser {
  username: string;
  password: string;
  email?: string;
  name?: string;
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
