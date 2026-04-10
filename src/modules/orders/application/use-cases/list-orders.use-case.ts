import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { IOrderRepository, ORDER_REPOSITORY } from '../../domain/ports/order.repository.port';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async byTenant(tenantId: string): Promise<Order[]> {
    return this.orderRepository.findPendingByTenant(tenantId);
  }

  async bySession(sessionId: string): Promise<Order[]> {
    return this.orderRepository.findBySessionId(sessionId);
  }
}
