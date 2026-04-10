import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISlugRepository } from '../../domain/ports/slug.repository.port';
import { TenantOrmEntity } from '../../../tenants/infrastructure/persistence/tenant.orm-entity';

@Injectable()
export class SlugRepository implements ISlugRepository {
  constructor(
    @InjectRepository(TenantOrmEntity)
    private readonly ormRepository: Repository<TenantOrmEntity>,
  ) {}

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.ormRepository.count({ where: { slug } });
    return count > 0;
  }
}
