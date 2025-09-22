import { Module } from '@nestjs/common';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from '../../common/utils/mailer.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [InvitesController],
  providers: [InvitesService, MailerService],
  exports: [InvitesService],
})
export class InvitesModule {}
