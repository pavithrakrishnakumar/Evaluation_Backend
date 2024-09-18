import { IsOptional, IsString, IsIn } from 'class-validator';

export class GetAllEmployeesDto {
  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  sortField?: string = 'createdAt'; // Default to 'createdAt'

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc'; // Default to ascending order
}
