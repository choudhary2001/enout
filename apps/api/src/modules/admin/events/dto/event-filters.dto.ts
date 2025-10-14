import { IsOptional, IsString } from 'class-validator';

export class EventFiltersDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  creatorId?: string;
}
