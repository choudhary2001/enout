import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/common/utils/redis.service';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('Authentication Flow (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let redisService: RedisService;
  
  // Test data
  const testEventId = 'clq1234567890abcdefghijkl'; // From seed
  const testEmail = 'e2e-test@example.com';
  let inviteId: string;
  let otpCode: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same middleware as in main.ts
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new HttpExceptionFilter());
    
    // Get services for test setup
    prismaService = app.get<PrismaService>(PrismaService);
    redisService = app.get<RedisService>(RedisService);
    
    await app.init();
  });

  afterAll(async () => {
    // Clean up test data
    await prismaService.invite.deleteMany({
      where: { email: testEmail },
    });
    await prismaService.attendee.deleteMany({
      where: { email: testEmail },
    });
    
    await app.close();
  });

  it('should import an invite', async () => {
    const response = await request(app.getHttpServer())
      .post(`/events/${testEventId}/invites/import`)
      .send({
        rows: [
          {
            email: testEmail,
            firstName: 'E2E',
            lastName: 'Test',
            countryCode: '+1',
            phone: '5551234567',
          },
        ],
      })
      .expect(201);

    expect(response.body).toHaveProperty('count', 1);

    // Get the invite ID for later use
    const invite = await prismaService.invite.findUnique({
      where: {
        eventId_email: {
          eventId: testEventId,
          email: testEmail,
        },
      },
    });
    
    inviteId = invite.id;
    expect(inviteId).toBeDefined();
  });

  it('should request an email OTP', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/request-email-otp')
      .send({
        email: testEmail,
        eventId: testEventId,
      })
      .expect(200);

    expect(response.body).toHaveProperty('ok', true);

    // For e2e test, we'll mock getting the OTP from Redis directly
    const otpKey = `otp:${testEventId}:${testEmail}`;
    otpCode = await redisService.get(otpKey);
    expect(otpCode).toBeDefined();
    expect(otpCode.length).toBe(5);
  });

  it('should verify email with OTP and return a token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/verify-email')
      .send({
        email: testEmail,
        code: otpCode,
        eventId: testEventId,
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('inviteStatus');
    expect(response.body).toHaveProperty('attendee');
    expect(response.body.attendee.email).toBe(testEmail);
  });

  it('should list guests with the new invite', async () => {
    const response = await request(app.getHttpServer())
      .get(`/events/${testEventId}/invites`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data.length).toBeGreaterThan(0);
    
    const testInvite = response.body.data.find(guest => guest.email === testEmail);
    expect(testInvite).toBeDefined();
    expect(testInvite.derivedStatus).toBe('email_verified');
  });
});
