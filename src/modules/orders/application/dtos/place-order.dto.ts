import { ArrayMinSize, IsArray, IsOptional, IsString, IsUUID, MaxLength, ValidateNested, IsInt, Min, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderItemInputDto {
  @ApiProperty()
  @IsUUID()
  menuItemId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ example: 'sem cebola' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  notes?: string;
}

export class PlaceOrderDto {
  @ApiProperty()
  @IsUUID()
  participantId: string;

  @ApiProperty({ type: [OrderItemInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items: OrderItemInputDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  notes?: string;
}
