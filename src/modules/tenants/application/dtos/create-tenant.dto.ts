import { IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderModeEnum } from '../../domain/value-objects/order-mode.vo';

export class CreateTenantDto {
  @ApiProperty({ example: 'Padaria do Zé' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'padaria-do-ze' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must contain only lowercase letters, numbers and hyphens',
  })
  @MaxLength(63)
  slug: string;

  @ApiPropertyOptional({ enum: OrderModeEnum, default: OrderModeEnum.TABLE })
  @IsOptional()
  @IsEnum(OrderModeEnum)
  orderMode?: OrderModeEnum;
}
