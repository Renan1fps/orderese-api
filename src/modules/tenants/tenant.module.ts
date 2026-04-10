import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantOrmEntity } from './infrastructure/persistence/tenant.orm-entity';
import { TenantRepository } from './infrastructure/persistence/tenant.repository';
import { TENANT_REPOSITORY } from './domain/ports/tenant.repository.port';
import { CreateTenantUseCase } from './application/use-cases/create-tenant.use-case';
import { GetTenantUseCase } from './application/use-cases/get-tenant.use-case';
import { TenantController } from './infrastructure/http/tenant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TenantOrmEntity])],
  controllers: [TenantController],
  providers: [
    { provide: TENANT_REPOSITORY, useClass: TenantRepository },
    CreateTenantUseCase,
    GetTenantUseCase,
  ],
  exports: [GetTenantUseCase, TENANT_REPOSITORY],
})
export class TenantModule {}
