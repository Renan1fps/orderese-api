export const PAYMENT_SERVICE = Symbol('PAYMENT_SERVICE');

export interface CreateSubscriptionParams {
  tenantId: string;
  email: string;
  name: string;
  priceId: string;
}

export interface SubscriptionResult {
  gatewayCustomerId: string;
  gatewaySubscriptionId: string;
  checkoutUrl: string;
}

export interface NormalizedWebhookEvent {
  type: 'subscription.activated' | 'subscription.cancelled' | 'payment.failed' | 'unknown';
  gatewayCustomerId?: string;
  gatewaySubscriptionId?: string;
  expiresAt?: Date;
  rawPayload: Record<string, unknown>;
}

export interface IPaymentService {
  readonly gatewayName: string;
  createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResult>;
  cancelSubscription(gatewaySubscriptionId: string): Promise<void>;
  parseWebhookEvent(rawBody: Buffer, signature: string): NormalizedWebhookEvent;
}
