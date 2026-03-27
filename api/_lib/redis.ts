type RedisLike = {
  isOpen: boolean;
  connect: () => Promise<void>;
  on: (event: "error", listener: (error: unknown) => void) => void;
  hGetAll: (key: string) => Promise<Record<string, string>>;
  hIncrBy: (key: string, field: string, increment: number) => Promise<number>;
};

declare global {
  // Reuse Redis client between invocations in dev/serverless warm runtime.
  var __kebabeatsRedisClient__: RedisLike | undefined;
}

let connectPromise: Promise<void> | null = null;

export async function getRedisClient() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;

  let client = globalThis.__kebabeatsRedisClient__;
  if (!client) {
    try {
      const redisModule = (await import("redis")) as {
        createClient: (opts: {
          url: string;
          socket: { reconnectStrategy: (retries: number) => number };
        }) => RedisLike;
      };

      client = redisModule.createClient({
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

