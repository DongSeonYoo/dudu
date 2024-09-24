import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from 'src/token/token.module';
import { RedisModule } from 'src/redis/redis.module';
import { JwtAccessStrategy } from './stratagies/jwt-access.strategy';

@Module({
  imports: [TokenModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy],
})
export class AuthModule {}
