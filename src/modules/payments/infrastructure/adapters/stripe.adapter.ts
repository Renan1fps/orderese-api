import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  IPaymentService,
  CreateSubscriptionParams,
  SubscriptionResult,
  NormalizedWebhookEvent,
} from '../../domain/ports/payment.service.port';

@Injectable()
export class StripeAdapter implements IPaymentService {
  readonly gatewayName = 'stripe';

  private readonly stripe: Stripe;
  private readonly webhookSecret: string;
  private readonly logger = new Logger(StripeAdapter.name);

  constructor(private readonly config: ConfigService) {
    this.stripe = new Stripe(config.getOrThrow<string>('STRIPE_SECRET_KEY'));
    this.webhookSecret = config.getOrThrow<string>('STRIPE_WEBHOOK_SECRET');
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResult> {
    const customer = await this.stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: { tenantId: params.tenantId },
    });

    const session = await this.stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      line_items: [{ price: params.priceId, quantity: 1 }],
      success_url: `${this.config.get('APP_URL', 'http://localhost:3000')}/payments/success`,
      cancel_url: `${this.config.get('APP_URL', 'http://localhost:3000')}/payments/cancel`,
      metadata: { tenantId: params.tenantId },
    });

    return {
      gatewayCustomerId: customer.id,
      gatewaySubscriptionId: '',
      checkoutUrl: session.url ?? '',
    };
  }

  async cancelSubscription(gatewaySubscriptionId: string): Promise<void> {
    await this.stripe.subscriptions.cancel(gatewaySubscriptionId);
  }

  parseWebhookEvent(rawBody: Buffer, signature: string): NormalizedWebhookEvent {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
    } catch (err) {
      this.logger.error('Invalid Stripe webhook signature', err);
      throw new Error('Invalid webhook signature');
    }

    const raw = event.data.object as Record<string, unknown>;

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const isActive = sub.status === 'active' || sub.status === 'trialing';
        if (!isActive) return { type: 'unknown', rawPayload: raw };
        return {
          type: 'subscription.activated',
          gatewayCustomerId: sub.customer as string,
          gatewaySubscriptionId: sub.id,
          expiresAt: new Date(sub.current_period_end * 1000),
          rawPayload: raw,
        };
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        return {
          type: 'subscription.cancelled',
          gatewayCustomerId: sub.customer as string,
          gatewaySubscriptionId: sub.id,
          rawPayload: raw,
        };
      }

      case 'invoice.payment_failed': {
        const inv = event.data.object as Stripe.Invoice;
        return {
          type: 'payment.failed',
          gatewayCustomerId: inv.customer as string,
          rawPayload: raw,
        };
      }

      default:
        return { type: 'unknown', rawPayload: raw };
    }
  }
}
