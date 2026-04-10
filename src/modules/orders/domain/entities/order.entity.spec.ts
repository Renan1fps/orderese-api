import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../value-objects/order-status.vo';
import { BusinessRuleViolationException } from '../../../../shared/exceptions/domain.exception';

const makeItem = (orderId = 'order-1') =>
  OrderItem.create({ orderId, menuItemId: 'item-1', name: 'X-Burguer', quantity: 2, unitPrice: 32.9 });

describe('Order', () => {
  it('should create an order with PENDING status', () => {
    const item = makeItem();
    const order = Order.create({ sessionId: 's-1', participantId: 'p-1', tenantId: 't-1', items: [item] });

    expect(order.status).toBe(OrderStatus.PENDING);
    expect(order.total).toBe(65.8);
  });

  it('should not create an order without items', () => {
    expect(() =>
      Order.create({ sessionId: 's-1', participantId: 'p-1', tenantId: 't-1', items: [] }),
    ).toThrow(BusinessRuleViolationException);
  });

  it('should transition PENDING -> PREPARING', () => {
    const order = Order.create({ sessionId: 's-1', participantId: 'p-1', tenantId: 't-1', items: [makeItem()] });
    order.transitionTo(OrderStatus.PREPARING);
    expect(order.status).toBe(OrderStatus.PREPARING);
  });

  it('should not allow invalid transition PENDING -> DELIVERED', () => {
    const order = Order.create({ sessionId: 's-1', participantId: 'p-1', tenantId: 't-1', items: [makeItem()] });
    expect(() => order.transitionTo(OrderStatus.DELIVERED)).toThrow(BusinessRuleViolationException);
  });

  it('should calculate total correctly with multiple items', () => {
    const item1 = OrderItem.create({ orderId: 'o-1', menuItemId: 'i-1', name: 'Item A', quantity: 1, unitPrice: 10 });
    const item2 = OrderItem.create({ orderId: 'o-1', menuItemId: 'i-2', name: 'Item B', quantity: 3, unitPrice: 5.5 });
    const order = Order.create({ sessionId: 's-1', participantId: 'p-1', tenantId: 't-1', items: [item1, item2] });
    expect(order.total).toBe(26.5);
  });
});
