import { createClient, type RedisClientType } from "redis";

declare global {
  // Reuse Redis client between invocations in dev/serverless warm runtime.
  var __kebabeatsRedisClient__: RedisClientType | undefined;
}

const redisUrl = process.env.REDIS_URL;

const client: RedisClientType | null = redisUrl
  ? globalThis.__kebabeatsRedisClient__ ??
    createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 100, 1000),
      },
    })
  : null;

if (client && !globalThis.__kebabeatsRedisClient__) {
  globalThis.__kebabeatsRedisClient__ = client;
}

let connectPromise: Promise<void> | null = null;

export async function getRedisClient() {
  if (!client) return null;

  if (!client.isOpen) {
    connectPromise ??= client.connect().then(() => undefined);
    await connectPromise;
  }

  return client;
}

