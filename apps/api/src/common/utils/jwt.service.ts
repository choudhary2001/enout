import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

// Type definition for StringValue from ms package
type Unit =
  | 'Years' | 'Year' | 'Yrs' | 'Yr' | 'Y'
  | 'Weeks' | 'Week' | 'W'
  | 'Days' | 'Day' | 'D'
  | 'Hours' | 'Hour' | 'Hrs' | 'Hr' | 'H'
  | 'Minutes' | 'Minute' | 'Mins' | 'Min' | 'M'
  | 'Seconds' | 'Second' | 'Secs' | 'Sec' | 's'
  | 'Milliseconds' | 'Millisecond' | 'Msecs' | 'Msec' | 'Ms';

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

type StringValue =
  | `${number}`
  | `${number}${UnitAnyCase}`
  | `${number} ${UnitAnyCase}`;

@Injectable()
export class JwtService {
  private readonly secret: string;

  constructor(private readonly configService: ConfigService) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    
    if (!jwtSecret) {
      console.warn('WARNING: Using default JWT secret. Set JWT_SECRET environment variable for production.');
      this.secret = 'dev-secret';
    } else {
      this.secret = jwtSecret;
    }
  }

  /**
   * Sign a JWT token
   * @param payload The data to include in the token
   * @param expiresIn Token expiration time (default: 24h)
   * @returns The signed JWT token
   */
  sign(payload: Record<string, any>, expiresIn: StringValue | number = '24h'): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  /**
   * Verify a JWT token
   * @param token The JWT token to verify
   * @returns The decoded token payload
   * @throws Error if token is invalid
   */
  verify(token: string): Record<string, any> {
    return jwt.verify(token, this.secret) as Record<string, any>;
  }

  /**
   * Decode a JWT token without verification
   * @param token The JWT token to decode
   * @returns The decoded token payload or null if invalid
   */
  decode(token: string): Record<string, any> | null {
    return jwt.decode(token) as Record<string, any> | null;
  }
}
