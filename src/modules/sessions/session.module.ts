import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionOrmEntity } from './infrastructure/persistence/session.orm-entity';
import { SessionParticipantOrmEntity } from './infrastructure/persistence/session-participant.orm-entity';
import { SessionRepository } from './infrastructure/persistence/session.repository';
import { SESSION_REPOSITORY } from './domain/ports/session.repository.port';
import { OpenOrResumeSessionUseCase } from './application/use-cases/open-or-resume-session.use-case';
import { CloseSessionUseCase } from './application/use-cases/close-session.use-case';
import { SessionController } from './infrastructure/http/session.controller';
import { TableModule } from '../tables/table.module';
import { TenantModule } from '../tenants/tenant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionOrmEntity, SessionParticipantOrmEntity]),
    TableModule,
    TenantModule,
  ],
  controllers: [SessionController],
  providers: [
    { provide: SESSION_REPOSITORY, useClass: SessionRepository },
    OpenOrResumeSessionUseCase,
    CloseSessionUseCase,
  ],
  exports: [SESSION_REPOSITORY],
})
export class SessionModule {}
