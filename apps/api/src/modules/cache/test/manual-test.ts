import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { RedisModule } from '../redis.module';
import { RedisService } from '../redis.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule,
  ],
})
class TestModule {}

async function testRedis() {
  try {
    console.log('\n🔍 Starting Redis service tests...\n');

    const app = await NestFactory.create(TestModule, {
      logger: ['error', 'warn', 'log', 'debug'],
    });
    const redisService = app.get(RedisService);

    const testEmail = 'test@example.com';
    const testOtp = '123456';

    // Test 1: Store OTP
    console.log('📝 Testing OTP Storage...');
    await redisService.storeOtp(testEmail, testOtp);
    console.log('✅ OTP stored successfully\n');

    // Test 2: Verify correct OTP
    console.log('🔍 Testing OTP Verification (correct OTP)...');
    const isValid = await redisService.verifyOtp(testEmail, testOtp);
    console.log('Result:', isValid ? '✅ Valid' : '❌ Invalid', '\n');

    // Test 3: Try to verify again (should fail as OTP is invalidated after successful verification)
    console.log('🔍 Testing OTP Re-use (should fail)...');
    const isReusable = await redisService.verifyOtp(testEmail, testOtp);
    console.log('Result:', !isReusable ? '✅ Correctly rejected' : '❌ Incorrectly accepted', '\n');

    // Test 4: Store new OTP and test wrong attempts
    console.log('🔍 Testing Max Attempts...');
    await redisService.storeOtp(testEmail, testOtp);
    
    try {
      for (let i = 0; i < 4; i++) {
        console.log(`Attempt ${i + 1} with wrong OTP...`);
        await redisService.verifyOtp(testEmail, 'wrong-otp');
      }
    } catch (err) {
      const error = err as Error;
      if (error.message === 'Maximum OTP verification attempts exceeded') {
        console.log('✅ Max attempts correctly enforced\n');
      } else {
        throw error;
      }
    }

    // Test 5: Manual invalidation
    console.log('🔍 Testing Manual Invalidation...');
    await redisService.storeOtp(testEmail, testOtp);
    await redisService.invalidateOtp(testEmail);
    const isStillValid = await redisService.verifyOtp(testEmail, testOtp);
    console.log('Result:', !isStillValid ? '✅ Successfully invalidated' : '❌ Still valid', '\n');

    console.log('🎉 All tests completed!\n');
    await app.close();
    process.exit(0);
  } catch (err) {
    const error = err as Error;
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

testRedis();