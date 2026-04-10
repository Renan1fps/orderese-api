import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITenantRepository, TENANT_REPOSITORY } from '../../../tenants/domain/ports/tenant.repository.port';
import { NormalizedWebhookEvent } from '../../domain/ports/payment.service.port';
import { Inject } from '@nestjs/common';

@Injectable()
export class WebhookHandler {
  private readonly logger = new Logger(WebhookHandler.name);

  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async handle(event: NormalizedWebhookEvent, gatewayName: string): Promise<void> {
    this.logger.log(`Processing event: ${event.type} from ${gatewayName}`);

    switch (event.type) {
      case 'subscription.activated':
        await this.onSubscriptionActivated(event, gatewayName);
        break;
      case 'subscription.cancelled':
        await this.onSubscriptionCancelled(event);
        break;
      case 'payment.failed':
        await this.onPaymentFailed(event);
        break;
      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async onSubscriptionActivated(
    event: NormalizedWebhookEvent,
    gatewayName: string,
  ): Promise<void> {
    if (!event.gatewayCustomerId) return;

    const tenant = await this.tenantRepository.findByGatewayCustomerId(event.gatewayCustomerId);
    if (!tenant) {
      this.logger.warn(`Tenant not found for customerId: ${event.gatewayCustomerId}`);
      return;
    }

    tenant.activateSubscription({
      gatewayName,
      gatewayCustomerId: event.gatewayCustomerId,
      gatewaySubscriptionId: event.gatewaySubscriptionId ?? '',
      expiresAt: event.expiresAt ?? new Date(),
    });

    await this.tenantRepository.save(tenant);
    this.logger.log(`Tenant ${tenant.id} subscription activated`);
  }

  private async onSubscriptionCancelled(event: NormalizedWebhookEvent): Promise<void> {
    if (!event.gatewayCustomerId) return;

    const tenant = await this.tenantRepository.findByGatewayCustomerId(event.gatewayCustomerId);
    if (!tenant) return;

    tenant.cancelSubscription();
    await this.tenantRepository.save(tenant);
    this.logger.log(`Tenant ${tenant.id} subscription cancelled`);
  }

  private async onPaymentFailed(event: NormalizedWebhookEvent): Promise<void> {
    if (!event.gatewayCustomerId) return;

    const tenant = await this.tenantRepository.findByGatewayCustomerId(event.gatewayCustomerId);
    if (!tenant) return;

    tenant.markPastDue();
    await this.tenantRepository.save(tenant);
    this.logger.log(`Tenant ${tenant.id} marked as past_due`);
  }
}
