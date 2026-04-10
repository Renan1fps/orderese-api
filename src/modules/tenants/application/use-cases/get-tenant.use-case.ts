import { Inject, Injectable } from '@nestjs/common';
import { Tenant } from '../../domain/entities/tenant.entity';
import { ITenantRepository, TENANT_REPOSITORY } from '../../domain/ports/tenant.repository.port';
import { EntityNotFoundException } from '@shared/exceptions/domain.exception';

@Injectable()
export class GetTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async byId(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findById(id, id);
    if (!tenant) throw new EntityNotFoundException('Tenant', id);
    return tenant;
  }

  async bySlug(slug: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findBySlug(slug);
    if (!tenant) throw new EntityNotFoundException('Tenant', slug);
    return tenant;
  }
}
