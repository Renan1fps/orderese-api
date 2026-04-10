import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../domain/value-objects/order-status.vo';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
