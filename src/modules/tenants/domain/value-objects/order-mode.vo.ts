import { ValueObject } from '../../../../shared/domain/value-object.base';

export enum OrderModeEnum {
  TABLE = 'table',
  PER_CLIENT = 'per_client',
}

interface OrderModeProps {
  value: OrderModeEnum;
}

export class OrderMode extends ValueObject<OrderModeProps> {
  private constructor(props: OrderModeProps) {
    super(props);
  }

  static create(value: string): OrderMode {
    const normalized = value as OrderModeEnum;
    if (!Object.values(OrderModeEnum).includes(normalized)) {
      throw new Error(`Invalid order mode: ${value}`);
    }
    return new OrderMode({ value: normalized });
  }

  static table(): OrderMode {
    return new OrderMode({ value: OrderModeEnum.TABLE });
  }

  static perClient(): OrderMode {
    return new OrderMode({ value: OrderModeEnum.PER_CLIENT });
  }

  get value(): OrderModeEnum {
    return this.props.value;
  }

  isPerClient(): boolean {
    return this.props.value === OrderModeEnum.PER_CLIENT;
  }
}
