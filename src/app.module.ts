import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { StoreModule } from './store/store.module';
import { CacheModule } from './cache/cache.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [UserModule, AuthModule, StoreModule, CacheModule, ProductModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
