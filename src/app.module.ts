import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantModule } from './modules/tenants/tenant.module';
import { TableModule } from './modules/tables/table.module';
import { MenuModule } from './modules/menu/menu.module';
import { SessionModule } from './modules/sessions/session.module';
import { OrderModule } from './modules/orders/order.module';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentModule } from './modules/payments/payment.module';
import { SlugModule } from './modules/slugs/slug.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_DATABASE'),
        entities: [__dirname + '/modules/**/infrastructure/persistence/*.orm-entity{.ts,.js}'],
        synchronize: config.get<string>('NODE_ENV') === 'development',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    AuthModule,
    TenantModule,
    TableModule,
    MenuModule,
    SessionModule,
    OrderModule,
    PaymentModule,
    SlugModule,
  ],
})
export class AppModule {}
