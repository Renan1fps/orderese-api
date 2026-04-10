import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/infrastructure/guards/jwt-auth.guard';
import { PlaceOrderUseCase } from '../../application/use-cases/place-order.use-case';
import { UpdateOrderStatusUseCase } from '../../application/use-cases/update-order-status.use-case';
import { ListOrdersUseCase } from '../../application/use-cases/list-orders.use-case';
import { PlaceOrderDto } from '../../application/dtos/place-order.dto';
import { UpdateOrderStatusDto } from '../../application/dtos/update-order-status.dto';

@ApiTags('Orders')
@Controller()
export class OrderController {
  constructor(
    private readonly placeOrder: PlaceOrderUseCase,
    private readonly updateStatus: UpdateOrderStatusUseCase,
    private readonly listOrders: ListOrdersUseCase,
  ) {}

  @Post('tenants/:tenantId/sessions/:sessionId/orders')
  @ApiOperation({ summary: 'Place an order (PWA)' })
  place(
    @Param('tenantId') tenantId: string,
    @Param('sessionId') sessionId: string,
    @Body() dto: PlaceOrderDto,
  ) {
    return this.placeOrder.execute(tenantId, sessionId, dto);
  }

  @Get('tenants/:tenantId/orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List active orders for dashboard' })
  listByTenant(@Param('tenantId') tenantId: string) {
    return this.listOrders.byTenant(tenantId);
  }

  @Get('tenants/:tenantId/sessions/:sessionId/orders')
  @ApiOperation({ summary: 'List orders for a session (PWA)' })
  listBySession(@Param('sessionId') sessionId: string) {
    return this.listOrders.bySession(sessionId);
  }

  @Patch('tenants/:tenantId/orders/:orderId/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status (dashboard)' })
  updateOrderStatus(
    @Param('tenantId') tenantId: string,
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.updateStatus.execute(orderId, tenantId, dto);
  }
}
