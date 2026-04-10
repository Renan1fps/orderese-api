import { Entity } from '../../../../shared/domain/entity.base';
import { OrderStatus, ORDER_STATUS_TRANSITIONS } from '../value-objects/order-status.vo';
import { OrderItem } from './order-item.entity';
import { BusinessRuleViolationException } from '../../../../shared/exceptions/domain.exception';

export interface OrderProps {
  id: string;
  sessionId: string;
  participantId: string;
  tenantId: string;
  status: OrderStatus;
  notes: string | null;
  items: OrderItem[];
  createdAt: Date;
}

export class Order extends Entity<OrderProps> {
  private constructor(props: OrderProps) {
    super(props);
  }

  static create(params: {
    sessionId: string;
    participantId: string;
    tenantId: string;
    notes?: string;
    items: OrderItem[];
  }): Order {
    if (params.items.length === 0) {
      throw new BusinessRuleViolationException('Order must have at least one item');
    }
    return new Order({
      id: Entity.generateId(),
      sessionId: params.sessionId,
      participantId: params.participantId,
      tenantId: params.tenantId,
      status: OrderStatus.PENDING,
      notes: params.notes ?? null,
      items: params.items,
      createdAt: new Date(),
    });
  }

  static reconstitute(props: OrderProps): Order {
    return new Order(props);
  }

  get sessionId(): string { return this.props.sessionId; }
  get participantId(): string { return this.props.participantId; }
  get tenantId(): string { return this.props.tenantId; }
  get status(): OrderStatus { return this.props.status; }
  get notes(): string | null { return this.props.notes; }
  get items(): OrderItem[] { return this.props.items; }
  get createdAt(): Date { return this.props.createdAt; }

  get total(): number {
    return Number(this.props.items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2));
  }

  transitionTo(newStatus: OrderStatus): void {
    const allowed = ORDER_STATUS_TRANSITIONS[this.props.status];
    if (!allowed.includes(newStatus)) {
      throw new BusinessRuleViolationException(
        `Cannot transition order from "${this.props.status}" to "${newStatus}"`,
      );
    }
    this.props.status = newStatus;
  }
}
