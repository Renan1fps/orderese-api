import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPasswordHasher, PASSWORD_HASHER } from '../../domain/ports/password-hasher.port';
import { ITokenGenerator, TOKEN_GENERATOR } from '../../domain/ports/token-generator.port';
import { UserOrmEntity } from '../../infrastructure/persistence/user.orm-entity';
import { LoginDto } from '../dtos/login.dto';
import { AuthResult } from './register.use-case';

@Injectable()
export class LoginUseCase {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userOrm: Repository<UserOrmEntity>,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResult> {
    const user = await this.userOrm.findOneBy({ email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await this.hasher.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.tokenGenerator.generate({
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    });

    return { accessToken, tenantId: user.tenantId, userId: user.id };
  }
}
