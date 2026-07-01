import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

async function run() {
  try {
    const res = await redis.eval("return ARGV[1]", [], ["hello"]);
    console.log("Result with arrays:", res);
  } catch (e) {
    console.error("Error with arrays:", e.message);
  }

  try {
    const res2 = await redis.eval("return ARGV[1]", 0, "hello");
    console.log("Result with varargs:", res2);
  } catch (e) {
    console.error("Error with varargs:", e.message);
  }
}
run();
