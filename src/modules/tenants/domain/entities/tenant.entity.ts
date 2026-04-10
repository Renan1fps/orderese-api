import { Entity } from '@shared/domain/entity.base';
import { OrderMode, OrderModeEnum } from '../value-objects/order-mode.vo';
import { TenantSlug } from '../value-objects/tenant-slug.vo';

export enum SubscriptionStatus {
  TRIAL = 'trial',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
}

export interface TenantProps {
  id: string;
  name: string;
  slug: TenantSlug;
  orderMode: OrderMode;
  subscriptionStatus: SubscriptionStatus;
  gatewayName: string | null;
  gatewayCustomerId: string | null;
  gatewaySubscriptionId: string | null;
  subscriptionExpiresAt: Date | null;
  trialEndsAt: Date | null;
  createdAt: Date;
}

export class Tenant extends Entity<TenantProps> {
  private constructor(props: TenantProps) {
    super(props);
  }

  static create(params: {
    name: string;
    slug: string;
    orderMode?: string;
    trialDays?: number;
  }): Tenant {
    const now = new Date();
    const trialEndsAt = new Date(now);
    trialEndsAt.setDate(trialEndsAt.getDate() + (params.trialDays ?? 14));

    return new Tenant({
      id: Entity.generateId(),
      name: params.name,
      slug: TenantSlug.create(params.slug),
      orderMode: params.orderMode
        ? OrderMode.create(params.orderMode)
        : OrderMode.table(),
      subscriptionStatus: SubscriptionStatus.TRIAL,
      gatewayName: null,
      gatewayCustomerId: null,
      gatewaySubscriptionId: null,
      subscriptionExpiresAt: null,
      trialEndsAt,
      createdAt: now,
    });
  }

  static reconstitute(props: TenantProps): Tenant {
    return new Tenant(props);
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug.value;
  }

  get orderMode(): OrderModeEnum {
    return this.props.orderMode.value;
  }

  get subscriptionStatus(): SubscriptionStatus {
    return this.props.subscriptionStatus;
  }

  get gatewayCustomerId(): string | null {
    return this.props.gatewayCustomerId;
  }

  isActive(): boolean {
    if (this.props.subscriptionStatus === SubscriptionStatus.ACTIVE) return true;
    if (
      this.props.subscriptionStatus === SubscriptionStatus.TRIAL &&
      this.props.trialEndsAt !== null &&
      this.props.trialEndsAt > new Date()
    ) {
      return true;
    }
    return false;
  }

  activateSubscription(params: {
    gatewayName: string;
    gatewayCustomerId: string;
    gatewaySubscriptionId: string;
    expiresAt: Date;
  }): void {
    this.props.subscriptionStatus = SubscriptionStatus.ACTIVE;
    this.props.gatewayName = params.gatewayName;
    this.props.gatewayCustomerId = params.gatewayCustomerId;
    this.props.gatewaySubscriptionId = params.gatewaySubscriptionId;
    this.props.subscriptionExpiresAt = params.expiresAt;
  }

  cancelSubscription(): void {
    this.props.subscriptionStatus = SubscriptionStatus.CANCELLED;
  }

  markPastDue(): void {
    this.props.subscriptionStatus = SubscriptionStatus.PAST_DUE;
  }

  updateOrderMode(mode: string): void {
    this.props.orderMode = OrderMode.create(mode);
  }

  isPerClientMode(): boolean {
    return this.props.orderMode.isPerClient();
  }
}
