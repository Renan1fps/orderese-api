import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Tenant } from '../../domain/entities/tenant.entity';
import { ITenantRepository, TENANT_REPOSITORY } from '../../domain/ports/tenant.repository.port';
import { CreateTenantDto } from '../dtos/create-tenant.dto';

@Injectable()
export class CreateTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(dto: CreateTenantDto): Promise<Tenant> {
    const existing = await this.tenantRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException(`Slug "${dto.slug}" is already taken`);
    }

    const tenant = Tenant.create({
      name: dto.name,
      slug: dto.slug,
      orderMode: dto.orderMode,
    });

    return this.tenantRepository.save(tenant);
  }
}
