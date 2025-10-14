import { Module } from '@nestjs/common';
import { AdminEventsModule } from './events/admin-events.module';

@Module({
  imports: [AdminEventsModule],
  exports: [AdminEventsModule],
})
export class AdminModule {}