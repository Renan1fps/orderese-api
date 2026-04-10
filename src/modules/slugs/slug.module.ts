import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantOrmEntity } from '../tenants/infrastructure/persistence/tenant.orm-entity';
import { SlugRepository } from './infrastructure/persistence/slug.repository';
import { SLUG_REPOSITORY } from './domain/ports/slug.repository.port';
import { CheckSlugAvailabilityUseCase } from './application/use-cases/check-slug-availability.use-case';
import { SlugController } from './infrastructure/http/slug.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TenantOrmEntity])],
  controllers: [SlugController],
  providers: [
    { provide: SLUG_REPOSITORY, useClass: SlugRepository },
    CheckSlugAvailabilityUseCase,
  ],
})
export class SlugModule {}
