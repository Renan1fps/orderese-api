import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IOrderRepository } from '../../domain/ports/order.repository.port';
import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { OrderOrmEntity } from './order.orm-entity';
import { OrderItemOrmEntity } from './order-item.orm-entity';
import { OrderStatus } from '../../domain/value-objects/order-status.vo';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly orderOrm: Repository<OrderOrmEntity>,
    @InjectRepository(OrderItemOrmEntity)
    private readonly itemOrm: Repository<OrderItemOrmEntity>,
  ) {}

  async save(order: Order): Promise<Order> {
    await this.orderOrm.save(this.orderToOrm(order));
    await this.itemOrm.save(order.items.map(this.itemToOrm));
    return this.load(order.id, order.tenantId) as Promise<Order>;
  }

  async findById(id: string, tenantId: string): Promise<Order | null> {
    return this.load(id, tenantId);
  }

  async findBySessionId(sessionId: string): Promise<Order[]> {
    const orders = await this.orderOrm.findBy({ sessionId });
    if (orders.length === 0) return [];
    return this.hydrateOrders(orders);
  }

  async findPendingByTenant(tenantId: string): Promise<Order[]> {
    const orders = await this.orderOrm.find({
      where: [
        { tenantId, status: 'pending' },
        { tenantId, status: 'preparing' },
        { tenantId, status: 'ready' },
      ],
      order: { createdAt: 'ASC' },
    });
    if (orders.length === 0) return [];
    return this.hydrateOrders(orders);
  }

  private async load(id: string, tenantId: string): Promise<Order | null> {
    const row = await this.orderOrm.findOneBy({ id, tenantId });
    if (!row) return null;
    const [order] = await this.hydrateOrders([row]);
    return order;
  }

  private async hydrateOrders(orderRows: OrderOrmEntity[]): Promise<Order[]> {
    const ids = orderRows.map((o) => o.id);
    const itemRows = await this.itemOrm.findBy({ orderId: In(ids) });

    return orderRows.map((row) => {
      const items = itemRows
        .filter((i) => i.orderId === row.id)
        .map(this.itemToDomain);
      return this.orderToDomain(row, items);
    });
  }

  private orderToDomain(row: OrderOrmEntity, items: OrderItem[]): Order {
    return Order.reconstitute({
      id: row.id, sessionId: row.sessionId, participantId: row.participantId,
      tenantId: row.tenantId, status: row.status as OrderStatus,
      notes: row.notes, items, createdAt: row.createdAt,
    });
  }

  private orderToOrm(order: Order): OrderOrmEntity {
    const row = new OrderOrmEntity();
    row.id = order.id; row.sessionId = order.sessionId; row.participantId = order.participantId;
    row.tenantId = order.tenantId; row.status = order.status;
    row.notes = order.notes; row.createdAt = order.createdAt;
    return row;
  }

  private itemToDomain(row: OrderItemOrmEntity): OrderItem {
    return OrderItem.reconstitute({
      id: row.id, orderId: row.orderId, menuItemId: row.menuItemId,
      name: row.name, quantity: row.quantity, unitPrice: Number(row.unitPrice), notes: row.notes,
    });
  }

  private itemToOrm(item: OrderItem): OrderItemOrmEntity {
    const row = new OrderItemOrmEntity();
    row.id = item.id; row.orderId = item.orderId; row.menuItemId = item.menuItemId;
    row.name = item.name; row.quantity = item.quantity; row.unitPrice = item.unitPrice; row.notes = item.notes;
    return row;
  }
}
