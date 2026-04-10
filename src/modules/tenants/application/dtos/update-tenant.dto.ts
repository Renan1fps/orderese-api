import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderModeEnum } from '../../domain/value-objects/order-mode.vo';

export class UpdateTenantDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ enum: OrderModeEnum })
  @IsOptional()
  @IsEnum(OrderModeEnum)
  orderMode?: OrderModeEnum;
}
