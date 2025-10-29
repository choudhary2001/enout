import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppConfigModule } from '../config.module';
import { AppConfig } from '../app.config';

async function bootstrap() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppConfigModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  const appConfig = app.get(AppConfig);

  console.log('Configuration:', {
    nodeEnv: appConfig.nodeEnv,
    port: appConfig.port,
    apiUrl: appConfig.apiUrl,
    corsOrigins: appConfig.corsOrigins,
    rateLimit: appConfig.rateLimit,
    jwt: appConfig.jwt,
  });

  await app.close();
}

bootstrap();