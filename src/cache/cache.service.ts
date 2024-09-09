import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async set(key: string, value: any, ttl?: number): Promise<void> {
    this.logger.log(`Setting cache for key: ${key}`);
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await this.redisClient.set(key, stringValue, 'EX', ttl);
    } else {
      await this.redisClient.set(key, stringValue);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    this.logger.log(`Retrieving cache for key: ${key}`);
    const value = await this.redisClient.get(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value) as T;
  }

  async del(key: string): Promise<void> {
    this.logger.log(`Deleting cache for key: ${key}`);
    await this.redisClient.del(key);
  }

  async flushAll(): Promise<void> {
    this.logger.log(`Flushing all cache`);
    await this.redisClient.flushall();
  }
}
