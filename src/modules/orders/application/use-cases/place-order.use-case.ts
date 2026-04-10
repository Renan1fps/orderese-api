import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { IOrderRepository, ORDER_REPOSITORY } from '../../domain/ports/order.repository.port';
import { IMenuRepository, MENU_REPOSITORY } from '../../../menu/domain/ports/menu.repository.port';
import { ISessionRepository, SESSION_REPOSITORY } from '../../../sessions/domain/ports/session.repository.port';
import { PlaceOrderDto } from '../dtos/place-order.dto';
import {
  EntityNotFoundException,
  BusinessRuleViolationException,
} from '../../../../shared/exceptions/domain.exception';
import { OrdersGateway } from '../../infrastructure/websocket/orders.gateway';

@Injectable()
export class PlaceOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(MENU_REPOSITORY)
    private readonly menuRepository: IMenuRepository,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async execute(tenantId: string, sessionId: string, dto: PlaceOrderDto): Promise<Order> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session || session.tenantId !== tenantId) {
      throw new EntityNotFoundException('Session', sessionId);
    }
    if (!session.isOpen()) {
      throw new BusinessRuleViolationException('Cannot place order on a closed session');
    }

    const participant = await this.sessionRepository.findParticipantById(dto.participantId);
    if (!participant || participant.sessionId !== sessionId) {
      throw new EntityNotFoundException('Participant', dto.participantId);
    }

    const menuItemIds = dto.items.map((i) => i.menuItemId);
    const menuItems = await this.menuRepository.findItemsByIds(menuItemIds, tenantId);

    if (menuItems.length !== menuItemIds.length) {
      throw new BusinessRuleViolationException('One or more menu items are unavailable or do not exist');
    }

    const tempOrderId = uuid();

    const orderItems = dto.items.map((itemDto) => {
      const menuItem = menuItems.find((m) => m.id === itemDto.menuItemId)!;
      return OrderItem.create({
        orderId: tempOrderId,
        menuItemId: menuItem.id,
        name: menuItem.name,
        quantity: itemDto.quantity,
        unitPrice: menuItem.price,
        notes: itemDto.notes,
      });
    });

    const order = Order.create({
      sessionId,
      participantId: dto.participantId,
      tenantId,
      notes: dto.notes,
      items: orderItems,
    });

    const saved = await this.orderRepository.save(order);

    this.ordersGateway.notifyNewOrder(tenantId, saved);

    return saved;
  }
}
