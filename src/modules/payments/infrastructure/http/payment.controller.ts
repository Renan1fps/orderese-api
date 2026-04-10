import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/infrastructure/guards/jwt-auth.guard';
import { CreateCheckoutUseCase } from '../../application/use-cases/create-checkout.use-case';
import { WebhookHandler } from '../handlers/webhook.handler';
import { StripeAdapter } from '../adapters/stripe.adapter';

class CreateCheckoutDto {
  @ApiProperty()
  @IsEmail()
  ownerEmail: string;

  @ApiProperty()
  @IsString()
  ownerName: string;
}

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly createCheckout: CreateCheckoutUseCase,
    private readonly webhookHandler: WebhookHandler,
    private readonly stripeAdapter: StripeAdapter,
  ) {}

  @Post('checkout/:tenantId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe Checkout session for subscription' })
  checkout(@Param('tenantId') tenantId: string, @Body() dto: CreateCheckoutDto) {
    return this.createCheckout.execute(tenantId, dto.ownerEmail, dto.ownerName);
  }

  @Post('webhook/stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const event = this.stripeAdapter.parseWebhookEvent(req.rawBody!, signature);
    await this.webhookHandler.handle(event, 'stripe');
    return { received: true };
  }
}
