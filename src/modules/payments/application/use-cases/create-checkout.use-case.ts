import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPaymentService, PAYMENT_SERVICE, SubscriptionResult } from '../../domain/ports/payment.service.port';
import { ITenantRepository, TENANT_REPOSITORY } from '../../../tenants/domain/ports/tenant.repository.port';
import { EntityNotFoundException } from '../../../../shared/exceptions/domain.exception';

@Injectable()
export class CreateCheckoutUseCase {
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly paymentService: IPaymentService,
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
    private readonly config: ConfigService,
  ) {}

  async execute(tenantId: string, ownerEmail: string, ownerName: string): Promise<SubscriptionResult> {
    const tenant = await this.tenantRepository.findById(tenantId, tenantId);
    if (!tenant) throw new EntityNotFoundException('Tenant', tenantId);

    const priceId = this.config.getOrThrow<string>('STRIPE_MONTHLY_PRICE_ID');

    const result = await this.paymentService.createSubscription({
      tenantId,
      email: ownerEmail,
      name: ownerName,
      priceId,
    });

    tenant['props'].gatewayName = this.paymentService.gatewayName;
    tenant['props'].gatewayCustomerId = result.gatewayCustomerId;
    await this.tenantRepository.save(tenant);

    return result;
  }
}
