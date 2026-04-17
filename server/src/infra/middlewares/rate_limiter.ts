import rate_limit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis from '../database/redis';

//  Express Limiter

export const rate_restriction = rate_limit({
  max: 100,
  windowMs: 60 * 60 * 1000, // remarks: restrict 100 visits each hour
  statusCode: 429, // learnt: code 429 for overloading requests
  message: {
    status: 'failed',
    message:
      '[SERVER] error: client requests overloading, please try it later.',
  },
  store: new RedisStore({
    //  learnt: sendCommand forwards redis commands (e.g. expiry info) to redis server
    //  learnt: node-redis has packaged the commands in ver 4
    sendCommand: (command: string, ...args: string[]) =>
      redis.sendCommand([command, ...args]),
    //  leanrt: prefix as the namespace to isolate data in sesion from cache keys
    prefix: 'app_v1:session:',
  }),
  standardHeaders: true,
  legacyHeaders: false,
});
