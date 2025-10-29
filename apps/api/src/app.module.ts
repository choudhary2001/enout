import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './modules/auth/auth.module';
import { InvitesModule } from './modules/invites/invites.module';
import { AttendeesModule } from './modules/attendees/attendees.module';
import { ScheduleModule } from './schedule/schedule.module';
import { MessagesModule } from './modules/messages/messages.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { EmailModule } from './modules/email/email.module';
import { RedisModule } from './modules/cache/redis.module';
import { AdminModule } from './modules/admin/admin.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { AppConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    PrismaModule,
    EventsModule,
    AuthModule,
    InvitesModule,
    AttendeesModule,
    ScheduleModule,
    MessagesModule,
    MobileModule,
    EmailModule,
    RedisModule,
    AdminModule,
    RoomsModule,
  ],
  providers: [AppConfig],
  exports: [AppConfig],
})
export class AppModule { }