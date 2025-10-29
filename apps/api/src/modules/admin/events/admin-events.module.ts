import { Module } from '@nestjs/common';
import { AdminEventsController } from './admin-events.controller';
import { AdminEventsService } from './admin-events.service';
import { PrismaModule } from '../../../lib/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminEventsController],
  providers: [AdminEventsService],
  exports: [AdminEventsService],
})
export class AdminEventsModule {}
