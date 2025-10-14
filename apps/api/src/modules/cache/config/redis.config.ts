import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  otpTtl: number; // Time-to-live for OTP in seconds
  maxAttempts: number; // Maximum OTP verification attempts
}

export default registerAs('redis', () => {
  const config: RedisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    otpTtl: parseInt(process.env.REDIS_OTP_TTL || '300', 10), // 5 minutes default
    maxAttempts: parseInt(process.env.REDIS_OTP_MAX_ATTEMPTS || '3', 10), // 3 attempts default
  };

  const schema = Joi.object<RedisConfig>({
    host: Joi.string().required().description('Redis host'),
    port: Joi.number().port().required().description('Redis port'),
    password: Joi.string().optional().description('Redis password'),
    otpTtl: Joi.number().min(60).max(3600).default(300).description('OTP TTL in seconds'),
    maxAttempts: Joi.number().min(1).max(10).default(3).description('Maximum OTP verification attempts'),
  });

  const { error, value } = schema.validate(config, { abortEarly: false });

  if (error) {
    throw new Error(`Redis configuration validation error: ${error.message}`);
  }

  return value;
});
