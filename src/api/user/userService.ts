import { AuthorizationError } from "../../errors/auth/auth.js";
import {
  EntityAlreadyExistsError,
  EntityNotFoundError,
} from "../../errors/db/db.js";
import { hashPassword } from "../../utils/utils.js";
import UserRepository from "./userRepository.js";
import { CreateUser, UpdateUser } from "./types.js";
import StorageService from "../../services/logger/storage/storage.js";
import { StorageError } from "../../errors/general/general.js";
import { User } from "@prisma/client";
interface UserWithAvatarUrl extends User {
  avatarUrl: string;
}
export default class UserService {
  private userRepo;
  private readonly storage;
  constructor(userRepo: UserRepository, storage: StorageService) {
    this.userRepo = userRepo;
    this.storage = storage;
  }
  async getAll(options = {}) {
    const users = await this.userRepo.all(options);

    const usersWithAvatarUrl: UserWithAvatarUrl[] = await Promise.all(
      users.map(async (user) => {
        let url = "";
        if (user.avatar) {
          url = await this.getAvatarUrlOrError(user.avatar);
        }
        return { ...user, avatarUrl: url };
      })
    );

    return usersWithAvatarUrl;
  }
  async getByIdOrError(id: number) {
    const user = await this.userRepo.findFirstWhere({ id });
    if (!user)
      throw new EntityNotFoundError(`User with ${id} id not found`, {});
    return user;
  }
  async getByUserNameOrError(username: string) {
    const user = await this.userRepo.findFirstWhere({ username });
    if (!user)
      throw new EntityNotFoundError(
        `User with ${username} username not found`,
        {}
      );
    let userWithAvatarUrl: UserWithAvatarUrl = { ...user, avatarUrl: "" };
    if (user.avatar) {
      const avatarUrl = await this.getAvatarUrlOrError(user.avatar);
      userWithAvatarUrl.avatarUrl = avatarUrl;
    } else {
      //fetchdefault avatar
    }
    return userWithAvatarUrl;
  }
  async throwErrorIfUserNotAuth(
    id: number | undefined,
    username: string
  ): Promise<void> {
    if (typeof id === "undefined") {
      throw new AuthorizationError("User not auth to do this operations", {});
    }

    const user = await this.userRepo.findFirstWhere({ id });

    if (!user) {
      throw new AuthorizationError(`User not found`, {}, 403);
    }
    if (user.username !== username) {
      throw new AuthorizationError(
        `User not authorized to do that operation - Invalid username`,
        {},
        403
      );
    }
  }

  async createOrError(data: CreateUser) {
    const { username, password } = data;
    const userExist = await this.userRepo.findFirstWhere({ username });
    if (userExist) {
      throw new EntityAlreadyExistsError(
        `Already exist a username ${data.username},try with another one`,
        {
          username: "Already exist",
        }
      );
    }
    const passwordHashed = await hashPassword(data.password);
    data.password = passwordHashed;
    const newUser = await this.userRepo.new(data);
    return newUser;
  }
  async updateOrError(
    username: string,
    data: UpdateUser,
    file: Express.Multer.File | undefined
  ) {
    //check if the username requested to update exist
    const userExist = await this.userRepo.findFirstWhere({ username });
    if (!userExist) {
      throw new EntityNotFoundError(`User ${username} not found`, {}, 404);
    }
    //check if the username request given is unique ignorin the actual user
    if (data.username && data.username !== username) {
      const userExistUsername = await this.userRepo.findFirstWhere({
        username: data.username,
      });
      if (userExistUsername) {
        throw new EntityAlreadyExistsError(
          `Already exist a username ${data.username},try with another one`,
          {
            username: `Already exist a username ${data.username},try with another one`,
          }
        );
      }
    }
    if (data.email) {
      const userExistEmail = await this.userRepo.findFirstWhere({
        email: data.email,
      });

      if (userExistEmail && userExistEmail.username !== username) {
        throw new EntityAlreadyExistsError(
          `The email provided is not valid, try with another one`,
          {
            email: `Already exist a email ${data.email},try with another one`,
          }
        );
      }
    }
    if (data.password) {
      const passwordHashed = await hashPassword(data.password);
      data.password = passwordHashed;
    }
    data.updatedAt = new Date();

    if (file) {
      console.log("FILE", file.size);
      const key = `user-${userExist.id}/avatar/avatar`;
      await this.storeAvatarOrError({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });
      data.avatar = key;
    }
    //emit event of avatar stored
    const userUpdate = await this.userRepo.updateByUsername(username, data);
    return userUpdate;
  }
  async deleteByUserNameOrError(username: string) {
    //get the user attempting to delete
    const userToDelete = await this.getByUserNameOrError(username);
    //delete avatar from S3
    if (userToDelete.avatar) {
      const resultAvatarDeleted = await this.deleteAvatarOrError(
        userToDelete.avatar
      );
      console.log("RESULT OF DELETING AVATAR:", resultAvatarDeleted);
    }

    const result = await this.userRepo.deleteWhere({
      username,
    });

    if (!result) {
      throw new EntityNotFoundError(
        `Error deleting user with ${username} username`,
        {},
        404
      );
    }
  }
  async getAvatarUrlOrError(avatar: string) {
    try {
      const url = await this.storage.get(avatar);
      return url;
    } catch (error) {
      console.log(
        "Error fetching avatar URL " +
          (error instanceof Error ? error.message : "")
      );
      throw new StorageError(
        "Error fetching avatar URL " +
          (error instanceof Error ? error.message : ""),
        {},
        500
      );
    }
  }

  async storeAvatarOrError(avatarFile: {
    key: string;
    body: Buffer;
    contentType: string;
  }) {
    try {
      const result = await (
        await this.storage.resize(avatarFile, 350, 350, "cover")
      ).store();

      console.log("RESULT OF STORING AVATAR", result);
      return result;
    } catch (error) {
      console.log(
        "Error uploading avatar file " +
          (error instanceof Error ? error.message : "")
      );
      throw new StorageError(
        "Error uploading avatar file " +
          (error instanceof Error ? error.message : ""),
        {},
        500
      );
    }
  }
  async deleteAvatarOrError(avatar: string) {
    const result = await this.storage.delete(avatar);
    return result;
  }
}
