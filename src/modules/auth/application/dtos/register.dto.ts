import { IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderModeEnum } from '../../../tenants/domain/value-objects/order-mode.vo';

export class RegisterTenantDto {
  @ApiProperty({ example: 'Minha Padaria' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'minha-padaria' })
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

export class RegisterOwnerDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'joao@padaria.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ type: RegisterTenantDto })
  @ValidateNested()
  @Type(() => RegisterTenantDto)
  tenant: RegisterTenantDto;

  @ApiProperty({ type: RegisterOwnerDto })
  @ValidateNested()
  @Type(() => RegisterOwnerDto)
  owner: RegisterOwnerDto;
}
