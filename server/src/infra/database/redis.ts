/* 
  Remarks:

  REDIS use for fast in-memory storage, reducing cost of frequent and repeated 
  database queries with cache hits.
*/

import path from 'path';
import dotenv from 'dotenv';
import { createClient, RedisClientType } from 'redis';
import logger from '../loggers';

dotenv.config({
  path: path.resolve(__dirname, '../../../process.env.example'),
  override: true,
});

//  Error handling
if (!process.env.REDIS_CONN || !process.env.REDIS_PW) {
  throw new Error(
    '[Redis] REDIS_CONN or REDIS_PW not set in environment variables',
  );
}

//  Setup redis connection
const redis: RedisClientType = createClient({
  url: `redis://default:${process.env.REDIS_PW}@${process.env.REDIS_CONN}`,
});

//  Chain methods
redis.on('error', (err) => {
  const err_message: string = `[DATABASE] error: redis connection not found in environment variables. ${err}`;
  logger.critical_logger.error(err_message);
});

const validate_connection = async () => {
  if (!redis.isOpen) await redis.connect();
  return redis;
};

//  Export

export { redis, validate_connection };
export default redis;
