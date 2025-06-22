import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const isSecure = REDIS_URL.startsWith("rediss://");

const client = new Redis(REDIS_URL, {
  ...(isSecure ? { tls: {} } : {}),
  lazyConnect: false,
});

// Log connection status
// client.on("connect", () => {
//   console.log("Connected to Redis");
// });
// client.on("error", (err) => {
//   console.error("Redis connection error:", err);
// });

const pub = client.duplicate();
const sub = client.duplicate();

export { client as redis, pub, sub };
