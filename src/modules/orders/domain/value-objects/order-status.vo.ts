export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]:   [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
  [OrderStatus.READY]:     [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};
