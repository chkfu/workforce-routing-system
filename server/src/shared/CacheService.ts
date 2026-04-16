import { RedisClientType } from 'redis';
import redis from '../infra/database/redis';
import ValueError from '../util/errors/ValueError';

//  Cache service class

class CacheService {
  //  attribute
  private name: string = 'CacheService';
  private redis: RedisClientType = redis;
  private query_ttl: number;
  private lock_ttl: number = 30;
  private timeout_base: number = 3000;
  private timeout_jitter: number = 0.1;

  //  constructor
  constructor() {
    this.query_ttl =
      this.timeout_base +
      Math.floor(this.timeout_base * this.timeout_jitter * Math.random());
  }

  //  1. redis supported methods

  public create_key(tb_name: string, id?: string) {
    const clean_tb = String(tb_name).trim().toLowerCase();
    const clean_id = id ? String(id).trim().toLowerCase() : 'all';
    return `${clean_tb}:${clean_id}`;
  }

  public validate_key(key: string) {
    if (!key || key.trim() === '')
      throw new ValueError(400, `[${this.name}] invalid cache key found.`);
    return key.trim().toLowerCase();
  }
  //  remarks: acquire lock to prevent race competition, ensure db updates remain in order
  public async acquire_lock(tb_name: string, id: string) {
    const cached_key: string = this.create_key(tb_name, id);
    const lock_key: string = `lock:${this.validate_key(cached_key)}`;
    const result = await this.redis.set(lock_key, 'locked', {
      NX: true,
      EX: this.lock_ttl,
    });
    return result ? true : false;
  }

  //  remarks: release after te existing job completed, subsequent query could exercise
  public async release_lock(cached_key: string) {
    const lock_key: string = `lock:${cached_key}`;
    this.del_cache(lock_key);
  }

  public async handle_lock(
    tb_name: string,
    id: string,
    target_task: () => Promise<any>,
  ) {
    const cached_key: string = this.create_key(tb_name, id);
    const lock_key: string = `lock:${this.validate_key(cached_key)}`;
    //  check lock status
    const is_locked: boolean = await this.acquire_lock(tb_name, id);
    if (!is_locked)
      throw new Error(
        `[${this.name}] error: cache access '${lock_key}' is currenly locked`,
      );
    //  execution
    try {
      //  case 1: proceed task
      return await target_task();
    } finally {
      //  case 2: release lock, if failed to complete without timeout
      await this.release_lock(cached_key);
    }
  }

  //  2. cacahe access methods

  //  * GET
  public async get_cache(key: string) {
    this.validate_key(key);
    const val = await this.redis.get(key);
    return val ? JSON.parse(val) : null;
  }

  //  * SET
  public async set_cache(cached_key: string, cached_val: any) {
    //  error handling
    if (
      cached_key === undefined ||
      cached_val === undefined ||
      cached_val == null
    ) {
      throw new ValueError(
        400,
        `[${this.name}] failed to set cached with invalid key,`,
      );
    }
    cached_key = this.validate_key(cached_key);
    //  set cache
    const stringified: string = JSON.stringify(cached_val);
    const result = await this.redis.set(cached_key, stringified, {
      // learnt: random * 30 for the 10% jitters, prevent overloading
      // remarks: if true, prevent override, as outdated record will be deleted each post/patch
      EX: this.query_ttl,
    });
    return result;
  }

  //  * DELETE
  public async del_cache(cached_key: string) {
    cached_key = this.validate_key(cached_key);
    await this.redis.del(cached_key);
  }
}

//  Export

export default CacheService;
