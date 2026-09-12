import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IPasswordHasher, PASSWORD_HASHER } from '../../domain/ports/password-hasher.port';
import { ITokenGenerator, TOKEN_GENERATOR } from '../../domain/ports/token-generator.port';
import { ITenantRepository, TENANT_REPOSITORY } from '../../../tenants/domain/ports/tenant.repository.port';
import { Tenant } from '../../../tenants/domain/entities/tenant.entity';
import { TenantOrmEntity } from '../../../tenants/infrastructure/persistence/tenant.orm-entity';
import { UserOrmEntity } from '../../infrastructure/persistence/user.orm-entity';
import { RegisterDto } from '../dtos/register.dto';

export interface AuthResult {
  accessToken: string;
  tenantId: string;
  userId: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userOrm: Repository<UserOrmEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: ITokenGenerator,
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResult> {
    const existingUser = await this.userOrm.findOneBy({ email: dto.owner.email });
    if (existingUser) throw new ConflictException('Este e-mail já está cadastrado.');

    const existingTenant = await this.tenantRepository.findBySlug(dto.tenant.slug);
    if (existingTenant) throw new ConflictException(`Slug "${dto.tenant.slug}" já está em uso.`);

    const tenant = Tenant.create({
      name: dto.tenant.name,
      slug: dto.tenant.slug,
      orderMode: dto.tenant.orderMode,
    });

    const passwordHash = await this.hasher.hash(dto.owner.password);

    const user = this.userOrm.create({
      id: Tenant.generateId(),
      tenantId: tenant.id,
      name: dto.owner.name,
      email: dto.owner.email,
      passwordHash,
      role: 'owner',
    });

    await this.dataSource.transaction(async (manager) => {
      await manager.insert(TenantOrmEntity, {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        orderMode: tenant.orderMode,
      });
      await manager.insert(UserOrmEntity, user);
    });

    const accessToken = this.tokenGenerator.generate({
      sub: user.id,
      tenantId: tenant.id,
      role: user.role,
    });

    return { accessToken, tenantId: tenant.id, userId: user.id };
  }
}
