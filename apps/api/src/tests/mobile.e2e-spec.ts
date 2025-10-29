import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '@/lib/prisma.service';
import { createTestingModule, cleanupTestingModule } from './test-setup';

describe('MobileController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const { app: testApp, moduleRef } = await createTestingModule();
    app = testApp;
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await cleanupTestingModule(app);
  });

  it('should create a test event', async () => {
    const testEvent = await prisma.event.create({
      data: {
        name: 'Test Event',
        startDate: new Date(),
        endDate: new Date(),
        timezone: 'UTC',
        status: 'draft',
        creator: {
          create: {
            email: 'test@example.com',
            name: 'Test User',
            role: 'ADMIN',
          },
        },
      },
    });

    expect(testEvent).toBeDefined();
    expect(testEvent.name).toBe('Test Event');
  });
});