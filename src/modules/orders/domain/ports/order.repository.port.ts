import { Order } from '../entities/order.entity';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface IOrderRepository {
  save(order: Order): Promise<Order>;
  findById(id: string, tenantId: string): Promise<Order | null>;
  findBySessionId(sessionId: string): Promise<Order[]>;
  findPendingByTenant(tenantId: string): Promise<Order[]>;
}
