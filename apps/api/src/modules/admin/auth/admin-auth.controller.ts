import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { AdminProfileResponseDto } from './dto/admin-profile.dto';

@ApiTags('Admin Auth')
@Controller('api/admin/auth')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminAuthController {
  @Get('profile')
  @ApiOperation({ summary: 'Get admin profile' })
  @ApiResponse({ status: 200, description: 'Admin profile' })
  async getProfile(@Request() req: { user: any }): Promise<AdminProfileResponseDto> {
    return {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    };
  }
}