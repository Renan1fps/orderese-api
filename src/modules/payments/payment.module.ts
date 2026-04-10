import { Module } from '@nestjs/common';
import { StripeAdapter } from './infrastructure/adapters/stripe.adapter';
import { PAYMENT_SERVICE } from './domain/ports/payment.service.port';
import { WebhookHandler } from './infrastructure/handlers/webhook.handler';
import { CreateCheckoutUseCase } from './application/use-cases/create-checkout.use-case';
import { PaymentController } from './infrastructure/http/payment.controller';
import { TenantModule } from '../tenants/tenant.module';

@Module({
  imports: [TenantModule],
  controllers: [PaymentController],
  providers: [
    StripeAdapter,
    { provide: PAYMENT_SERVICE, useClass: StripeAdapter },
    WebhookHandler,
    CreateCheckoutUseCase,
  ],
})
export class PaymentModule {}
