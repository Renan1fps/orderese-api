import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'X-Burguer' })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 32.9 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
