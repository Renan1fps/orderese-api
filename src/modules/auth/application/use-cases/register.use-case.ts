import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { IPasswordHasher, PASSWORD_HASHER } from '../../domain/ports/password-hasher.port';
import { ITokenGenerator, TOKEN_GENERATOR } from '../../domain/ports/token-generator.port';
import { ITenantRepository, TENANT_REPOSITORY } from '../../../tenants/domain/ports/tenant.repository.port';
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
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: ITokenGenerator,
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.userOrm.findOneBy({ email: dto.email });
    if (existing) throw new ConflictException('Email already in use');

    const tenant = await this.tenantRepository.findBySlug(dto.tenantSlug);
    if (!tenant) throw new ConflictException(`Tenant slug "${dto.tenantSlug}" not found. Create the tenant first.`);

    const passwordHash = await this.hasher.hash(dto.password);

    const user = this.userOrm.create({
      id: uuid(),
      tenantId: tenant.id,
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: 'owner',
    });

    await this.userOrm.save(user);

    const accessToken = this.tokenGenerator.generate({
      sub: user.id,
      tenantId: tenant.id,
      role: user.role,
    });

    return { accessToken, tenantId: tenant.id, userId: user.id };
  }
}
