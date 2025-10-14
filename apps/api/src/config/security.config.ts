import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppConfig } from './app.config';

export function configureSecurityMiddleware(
  app: INestApplication,
  config: AppConfig,
) {
  // Enable Helmet security headers
  app.use(helmet());

  // Enable rate limiting if configured
  if (config.rateLimit.enabled) {
    app.use(
      (rateLimit as any)({
        windowMs: config.rateLimit.window,
        max: config.rateLimit.maxRequests,
        message: {
          error: 'Too many requests, please try again later.',
        },
      }),
    );

    // Trust first proxy for rate limiting
    (app as any).set('trust proxy', 1);
  }
}