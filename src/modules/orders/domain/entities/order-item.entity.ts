import { Entity } from '../../../../shared/domain/entity.base';

export interface OrderItemProps {
  id: string;
  orderId: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  notes: string | null;
}

export class OrderItem extends Entity<OrderItemProps> {
  private constructor(props: OrderItemProps) {
    super(props);
  }

  static create(params: {
    orderId: string;
    menuItemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }): OrderItem {
    if (params.quantity <= 0) throw new Error('Quantity must be greater than 0');
    return new OrderItem({
      id: Entity.generateId(),
      orderId: params.orderId,
      menuItemId: params.menuItemId,
      name: params.name,
      quantity: params.quantity,
      unitPrice: params.unitPrice,
      notes: params.notes ?? null,
    });
  }

  static reconstitute(props: OrderItemProps): OrderItem {
    return new OrderItem(props);
  }

  get orderId(): string { return this.props.orderId; }
  get menuItemId(): string { return this.props.menuItemId; }
  get name(): string { return this.props.name; }
  get quantity(): number { return this.props.quantity; }
  get unitPrice(): number { return this.props.unitPrice; }
  get notes(): string | null { return this.props.notes; }

  get subtotal(): number {
    return Number((this.props.unitPrice * this.props.quantity).toFixed(2));
  }
}
