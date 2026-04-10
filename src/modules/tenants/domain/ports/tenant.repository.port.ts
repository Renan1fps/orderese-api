import { IRepository } from '../../../../shared/domain/repository.interface';
import { Tenant } from '../entities/tenant.entity';

export const TENANT_REPOSITORY = Symbol('TENANT_REPOSITORY');

export interface ITenantRepository extends IRepository<Tenant> {
  findBySlug(slug: string): Promise<Tenant | null>;
  findByGatewayCustomerId(customerId: string): Promise<Tenant | null>;
}
