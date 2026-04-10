import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTableDto {
  @ApiProperty({ example: 'Mesa 01' })
  @IsString()
  @MaxLength(50)
  label: string;

  @ApiPropertyOptional({ example: 4, default: 4 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  capacity?: number;
}
