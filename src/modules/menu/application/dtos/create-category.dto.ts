import { IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Lanches' })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
