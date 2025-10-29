import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { JwtStrategy } from './guards/jwt.strategy';
import { RedisModule } from '../../cache/redis.module';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'admin-jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret',
      signOptions: { expiresIn: '15m' },
    }),
    RedisModule,
    PrismaModule,
  ],
  providers: [AdminAuthService, JwtStrategy],
  controllers: [AdminAuthController],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
