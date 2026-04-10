import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderOrmEntity } from './infrastructure/persistence/order.orm-entity';
import { OrderItemOrmEntity } from './infrastructure/persistence/order-item.orm-entity';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { ORDER_REPOSITORY } from './domain/ports/order.repository.port';
import { PlaceOrderUseCase } from './application/use-cases/place-order.use-case';
import { UpdateOrderStatusUseCase } from './application/use-cases/update-order-status.use-case';
import { ListOrdersUseCase } from './application/use-cases/list-orders.use-case';
import { OrderController } from './infrastructure/http/order.controller';
import { OrdersGateway } from './infrastructure/websocket/orders.gateway';
import { MenuModule } from '../menu/menu.module';
import { SessionModule } from '../sessions/session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderOrmEntity, OrderItemOrmEntity]),
    MenuModule,
    SessionModule,
  ],
  controllers: [OrderController],
  providers: [
    { provide: ORDER_REPOSITORY, useClass: OrderRepository },
    OrdersGateway,
    PlaceOrderUseCase,
    UpdateOrderStatusUseCase,
    ListOrdersUseCase,
  ],
})
export class OrderModule {}
