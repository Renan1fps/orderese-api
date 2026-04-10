import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { BcryptHasher } from './infrastructure/adapters/bcrypt-hasher';
import { JwtTokenGenerator } from './infrastructure/adapters/jwt-token-generator';
import { PASSWORD_HASHER } from './domain/ports/password-hasher.port';
import { TOKEN_GENERATOR } from './domain/ports/token-generator.port';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { AuthController } from './infrastructure/http/auth.controller';
import { TenantModule } from '../tenants/tenant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRATION', '7d') },
      }),
    }),
    TenantModule,
  ],
  controllers: [AuthController],
  providers: [
    { provide: PASSWORD_HASHER, useClass: BcryptHasher },
    { provide: TOKEN_GENERATOR, useClass: JwtTokenGenerator },
    JwtStrategy,
    RegisterUseCase,
    LoginUseCase,
  ],
})
export class AuthModule {}
