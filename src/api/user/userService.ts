import { AuthorizationError } from "../../errors/auth/auth.js";
import {
  EntityAlreadyExistsError,
  EntityNotFoundError,
} from "../../errors/db/db.js";
import { hashPassword } from "../../utils/utils.js";
import UserRepository from "./repository.js";
import { CreateUser, UpdateUser } from "./types.js";

export default class UserService {
  private userRepo;
  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }
  async getAll(options = {}) {
    const users = await this.userRepo.all(options);
    return users;
  }
  async get(id: number) {
    const user = await this.userRepo.findByColumn("id", id);
    return user;
  }
  async throwErrorIfUserNotAuthToUpdate(
    id: number,
    username: string
  ): Promise<void> {
    const user = await this.userRepo.findByColumn("id", id);

    if (!user) {
      throw new AuthorizationError(`Forbidden - User not found`, 403);
    }
    if (user.username !== username) {
      throw new AuthorizationError(
        `User not authorized to update - Invalid username`,
        403
      );
    }
  }

  async create(data: CreateUser) {
    const userExist = await this.userRepo.findByColumn(
      "username",
      data.username
    );
    if (userExist) {
      throw new EntityAlreadyExistsError(
        `Already exist a username ${data.username},try with another one`
      );
    }
    const passwordHashed = await hashPassword(data.password);
    data.password = passwordHashed;
    const newUser = await this.userRepo.new(data);
    return newUser;
  }
  async update(username: string, data: UpdateUser) {
    const userExist = await this.userRepo.findByColumn(
      "username",
      data.username
    );
    if (!userExist) {
      throw new EntityNotFoundError(`User ${username} not found`, 404);
    }
    if (data.username && data.username !== username) {
      const userExistUsername = await this.userRepo.findByColumn(
        "username",
        data.username
      );
      if (userExistUsername) {
        throw new EntityAlreadyExistsError(
          `Already exist a username ${data.username},try with another one`
        );
      }
    }
    if (data.email) {
      const userExistEmail = await this.userRepo.findByColumn(
        "email",
        data.email
      );

      if (userExistEmail && userExistEmail.username !== username) {
        throw new EntityAlreadyExistsError(
          `The email provided is not valid, try with another one`
        );
      }
    }
    if (data.password) {
      const passwordHashed = await hashPassword(data.password);
      data.password = passwordHashed;
    }
    data.updatedAt = new Date();
    const userUpdate = await this.userRepo.updateByUsername(username, data);
    return userUpdate;
  }
}
