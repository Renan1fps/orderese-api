import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  private readonly logger = new Logger(OrdersGateway.name);

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Dashboard joins a room scoped to their tenant
  @SubscribeMessage('join:dashboard')
  handleJoinDashboard(
    @MessageBody() data: { tenantId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(`dashboard:${data.tenantId}`);
    this.logger.log(`Dashboard joined tenant room: ${data.tenantId}`);
  }

  // PWA client joins a room scoped to their session
  @SubscribeMessage('join:session')
  handleJoinSession(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(`session:${data.sessionId}`);
    this.logger.log(`Client joined session room: ${data.sessionId}`);
  }

  notifyNewOrder(tenantId: string, order: Order): void {
    this.server.to(`dashboard:${tenantId}`).emit('order:new', {
      orderId: order.id,
      sessionId: order.sessionId,
      participantId: order.participantId,
      status: order.status,
      total: order.total,
      items: order.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        notes: i.notes,
      })),
      createdAt: order.createdAt,
    });
  }

  notifyOrderStatusUpdate(tenantId: string, order: Order): void {
    // Notify dashboard
    this.server.to(`dashboard:${tenantId}`).emit('order:updated', {
      orderId: order.id,
      status: order.status,
    });

    // Notify the client's session room
    this.server.to(`session:${order.sessionId}`).emit('order:updated', {
      orderId: order.id,
      status: order.status,
    });
  }
}
