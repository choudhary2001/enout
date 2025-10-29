import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/lib/prisma.service';
import { RedisService } from '@/modules/cache/redis.service';
import { mockEmailService } from './mocks/email.service.mock';

export const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

export async function createTestingModule() {
  const moduleRef = await Test.createTestingModule({
    providers: [
      ConfigService,
      PrismaService,
      {
        provide: RedisService,
        useValue: mockRedisService,
      },
      {
        provide: 'EmailService',
        useValue: mockEmailService,
      },
    ],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  return {
    app,
    moduleRef,
  };
}

export async function cleanupTestingModule(app: INestApplication) {
  await app.close();
}