import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class TaskStatusDto {
  @ApiProperty({ example: 'upload_id' })
  @IsString()
  taskId!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  completed!: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  metadata?: string;
}

export class TasksResponseDto {
  @ApiProperty({ type: 'object', example: { 'upload_id': { completed: true } } })
  tasks!: Record<string, { completed: boolean; metadata?: string }>;
}
