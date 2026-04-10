import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITenantRepository } from '../../domain/ports/tenant.repository.port';
import { Tenant, SubscriptionStatus } from '../../domain/entities/tenant.entity';
import { TenantOrmEntity } from './tenant.orm-entity';
import { OrderMode } from '../../domain/value-objects/order-mode.vo';
import { TenantSlug } from '../../domain/value-objects/tenant-slug.vo';

@Injectable()
export class TenantRepository implements ITenantRepository {
  constructor(
    @InjectRepository(TenantOrmEntity)
    private readonly ormRepository: Repository<TenantOrmEntity>,
  ) {}

  async findById(id: string): Promise<Tenant | null> {
    const orm = await this.ormRepository.findOneBy({ id });
    return orm ? this.toDomain(orm) : null;
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    const orm = await this.ormRepository.findOneBy({ slug });
    return orm ? this.toDomain(orm) : null;
  }

  async findByGatewayCustomerId(customerId: string): Promise<Tenant | null> {
    const orm = await this.ormRepository.findOneBy({ gatewayCustomerId: customerId });
    return orm ? this.toDomain(orm) : null;
  }

  async save(tenant: Tenant): Promise<Tenant> {
    const orm = this.toOrm(tenant);
    const saved = await this.ormRepository.save(orm);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  private toDomain(orm: TenantOrmEntity): Tenant {
    return Tenant.reconstitute({
      id: orm.id,
      name: orm.name,
      slug: TenantSlug.create(orm.slug),
      orderMode: OrderMode.create(orm.orderMode),
      subscriptionStatus: orm.subscriptionStatus as SubscriptionStatus,
      gatewayName: orm.gatewayName,
      gatewayCustomerId: orm.gatewayCustomerId,
      gatewaySubscriptionId: orm.gatewaySubscriptionId,
      subscriptionExpiresAt: orm.subscriptionExpiresAt,
      trialEndsAt: orm.trialEndsAt,
      createdAt: orm.createdAt,
    });
  }

  private toOrm(tenant: Tenant): TenantOrmEntity {
    const orm = new TenantOrmEntity();
    orm.id = tenant.id;
    orm.name = tenant.name;
    orm.slug = tenant.slug;
    orm.orderMode = tenant.orderMode;
    orm.subscriptionStatus = tenant.subscriptionStatus;
    orm.gatewayName = tenant['props'].gatewayName;
    orm.gatewayCustomerId = tenant.gatewayCustomerId;
    orm.gatewaySubscriptionId = tenant['props'].gatewaySubscriptionId;
    orm.subscriptionExpiresAt = tenant['props'].subscriptionExpiresAt;
    orm.trialEndsAt = tenant['props'].trialEndsAt;
    orm.createdAt = tenant['props'].createdAt;
    return orm;
  }
}
