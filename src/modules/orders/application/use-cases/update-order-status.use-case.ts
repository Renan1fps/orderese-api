import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { IOrderRepository, ORDER_REPOSITORY } from '../../domain/ports/order.repository.port';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { EntityNotFoundException } from '../../../../shared/exceptions/domain.exception';
import { OrdersGateway } from '../../infrastructure/websocket/orders.gateway';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async execute(orderId: string, tenantId: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderRepository.findById(orderId, tenantId);
    if (!order) throw new EntityNotFoundException('Order', orderId);

    order.transitionTo(dto.status);
    const saved = await this.orderRepository.save(order);

    this.ordersGateway.notifyOrderStatusUpdate(tenantId, saved);

    return saved;
  }
}
