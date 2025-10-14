import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return parseInt(this.configService.get<string>('PORT', '3003'), 10);
  }

  get apiUrl(): string {
    return this.configService.get<string>('API_URL', 'http://localhost:3003');
  }

  get corsOrigins(): string[] {
    const origins = this.configService.get<string>('CORS_ORIGINS', 'http://localhost:3000');
    return origins.split(',').map(origin => origin.trim());
  }

  get rateLimit() {
    return {
      enabled: this.configService.get<boolean>('RATE_LIMIT_ENABLED', true),
      window: parseInt(this.configService.get<string>('RATE_LIMIT_WINDOW', '900000'), 10),
      maxRequests: parseInt(this.configService.get<string>('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
    };
  }

  get jwt() {
    return {
      secret: this.configService.get<string>('JWT_SECRET', 'your-jwt-secret-key'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1d'),
    };
  }
}

const appConfig = () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3003', 10),
  apiUrl: process.env.API_URL || 'http://localhost:3003',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map(origin => origin.trim()),
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    window: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});

export default appConfig;