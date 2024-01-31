import { RedisClientType, createClient } from "redis";
import dotenv from "dotenv";
import { RedisCommandArgument } from "@redis/client/dist/lib/commands/index.js";
import { RedisError } from "../errors/db/db.js";
import { env } from "../utils/utils.js";
import { error } from "console";

const client: RedisClientType = createClient({
  url: env.get("REDIS_URL"),
  socket: {
    connectTimeout: 50000,
  },
});

// await client.connect();

client.on("error", (err) => {
  throw new Error(`ERROR REDIS CLIENT ${err.message}`);
});
class RedisService {
  constructor(private readonly client: RedisClientType) {}

  async get(key: string) {
    try {
      return await this.client.get(key);
    } catch (error) {
      throw new RedisError(
        error instanceof Error
          ? error?.message
          : "Unexpected error getting value in redis"
      ); // Re-throw the error for proper handling in the calling code
    }
  }

  async set(key: string, value: RedisCommandArgument | number) {
    try {
      return await this.client.set(key, value);
    } catch (error) {
      throw new RedisError(
        error instanceof Error
          ? error?.message
          : "Unexpected error setting value in redis"
      );
    }
  }

  disconnect() {
    this.client.disconnect();
  }
}

export default new RedisService(client);
