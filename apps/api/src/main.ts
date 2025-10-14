import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { configureSwagger } from './config/swagger.config';
import { configureSecurityMiddleware } from './config/security.config';
import { ApiLogger } from './common/logger/api-logger.service';
import { AppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ApiLogger(),
  });

  // Get configuration
  const appConfig = app.get(AppConfig);

  // Enable CORS FIRST (before security middleware)
  app.enableCors({
    origin: appConfig.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Configure security middleware
  configureSecurityMiddleware(app, appConfig);

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Configure Swagger documentation
  if (appConfig.nodeEnv === 'development') {
    configureSwagger(app);
  }

  // Start server
  const port = appConfig.port || 3003;
  await app.listen(port);

  const logger = new ApiLogger();
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log('Environment:', appConfig.nodeEnv);
  logger.log('CORS origins:', appConfig.corsOrigins.join(', '));
  logger.log('Rate limit:', JSON.stringify(appConfig.rateLimit));
}

bootstrap();