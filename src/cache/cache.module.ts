import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
