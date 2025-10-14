import { ApiProperty } from '@nestjs/swagger';

export class AdminProfileResponseDto {
  @ApiProperty({ description: 'Admin ID' })
  id: string;

  @ApiProperty({ description: 'Admin email' })
  email: string;

  @ApiProperty({ description: 'Admin role', enum: ['ADMIN', 'SUPER_ADMIN'] })
  role: 'ADMIN' | 'SUPER_ADMIN';
}
