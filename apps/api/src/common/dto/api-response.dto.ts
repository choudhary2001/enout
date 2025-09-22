import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponse {
  @ApiProperty({ example: 'Bad Request' })
  error!: string;

  @ApiProperty({ example: 'Invalid input data' })
  message!: string;

  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({
    example: { email: 'must be a valid email' },
    required: false,
  })
  fields?: Record<string, string>;
}

export class PaginatedResponse<T> {
  @ApiProperty({ example: [{}], type: 'array' })
  data!: T[];

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  pageSize!: number;

  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}
