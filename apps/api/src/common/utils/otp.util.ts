/**
 * Generate a random numeric OTP code
 * @param length Length of the OTP code (default: 5)
 * @returns A string containing the OTP code
 */
export function generateOtp(length = 5): string {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  
  return otp;
}
