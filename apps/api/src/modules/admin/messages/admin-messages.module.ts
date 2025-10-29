import { Module } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma.service';

@Module({
  providers: [PrismaService],
})
export class AdminMessagesModule {}
