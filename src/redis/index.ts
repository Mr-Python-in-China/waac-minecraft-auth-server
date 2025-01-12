import logger from "@src/log";
import { createClient } from "redis";

const client = await createClient({
  url: process.env.REDIS_URL,
}).connect();

client.on("error", (err) => {
  logger.error("Error with redis:", err);
  process.exit(1);
});

export default client;
