import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { RedisModule } from '../cache/redis.module';
import { MessagesModule } from '../messages/messages.module';
import { EmailModule } from '../email/email.module';
import { TwilioService } from './twilio.service';
import { MobileJwtStrategy } from './guards/mobile-jwt.strategy';
import { MobileJwtAuthGuard } from './guards/mobile-jwt-auth.guard';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    MessagesModule,
    EmailModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TwilioService, MobileJwtStrategy, MobileJwtAuthGuard],
  exports: [AuthService, MobileJwtAuthGuard],
})
export class AuthModule { }