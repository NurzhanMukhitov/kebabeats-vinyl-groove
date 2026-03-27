import { createClient, type RedisClientType } from "redis";

declare global {
  // Reuse Redis client between invocations in dev/serverless warm runtime.
  var __kebabeatsRedisClient__: RedisClientType | undefined;
}

let connectPromise: Promise<void> | null = null;

export async function getRedisClient() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;

  let client = globalThis.__kebabeatsRedisClient__;
  if (!client) {
    try {
      client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 100, 1000),
        },
      });
      // Prevent process crash from unhandled "error" events in Node.
      client.on("error", () => {});
      globalThis.__kebabeatsRedisClient__ = client;
    } catch {
      return null;
    }
  }

  if (!client) return null;

  if (!client.isOpen) {
    try {
      connectPromise ??= client.connect().then(() => undefined);
      await connectPromise;
    } catch {
      connectPromise = null;
      return null;
    }
  }

  return client;
}

