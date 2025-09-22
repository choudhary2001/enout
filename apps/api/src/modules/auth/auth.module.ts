import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from '../../common/utils/redis.service';
import { MailerService } from '../../common/utils/mailer.service';
import { RateLimiterService } from '../../common/utils/rate-limiter.util';
import { JwtService } from '../../common/utils/jwt.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    RedisService,
    MailerService,
    RateLimiterService,
    JwtService,
  ],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
