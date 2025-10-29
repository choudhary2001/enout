import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('api/health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check API health' })
  @ApiResponse({ 
    status: 200, 
    description: 'API is healthy',
    schema: {
      type: 'object',
      properties: {
        ok: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  check() {
    return { ok: true };
  }
}
