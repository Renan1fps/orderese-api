import { Inject, Injectable } from '@nestjs/common';
import { Session } from '../../domain/entities/session.entity';
import { SessionParticipant } from '../../domain/entities/session-participant.entity';
import { ISessionRepository, SESSION_REPOSITORY } from '../../domain/ports/session.repository.port';
import { ITableRepository, TABLE_REPOSITORY } from '../../../tables/domain/ports/table.repository.port';
import { ITenantRepository, TENANT_REPOSITORY } from '../../../tenants/domain/ports/tenant.repository.port';
import { EntityNotFoundException, BusinessRuleViolationException } from '../../../../shared/exceptions/domain.exception';
import { JoinSessionDto } from '../dtos/join-session.dto';

export interface OpenOrResumeResult {
  session: Session;
  participant: SessionParticipant;
}

@Injectable()
export class OpenOrResumeSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
    @Inject(TABLE_REPOSITORY)
    private readonly tableRepository: ITableRepository,
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(qrToken: string, dto: JoinSessionDto): Promise<OpenOrResumeResult> {
    const table = await this.tableRepository.findByQrToken(qrToken);
    if (!table) throw new EntityNotFoundException('Table', qrToken);

    const tenant = await this.tenantRepository.findById(table.tenantId, table.tenantId);
    if (!tenant) throw new EntityNotFoundException('Tenant', table.tenantId);

    if (!tenant.isActive()) {
      throw new BusinessRuleViolationException('This establishment is currently inactive');
    }

    // Open new session or resume existing open one
    let session = await this.sessionRepository.findOpenSessionByTableId(table.id);
    if (!session) {
      session = Session.open({ tenantId: table.tenantId, tableId: table.id });
      session = await this.sessionRepository.saveSession(session);
      table.markOccupied();
      await this.tableRepository.save(table);
    }

    const participant = await this.resolveParticipant(session, tenant.isPerClientMode(), dto);

    return { session, participant };
  }

  private async resolveParticipant(
    session: Session,
    isPerClientMode: boolean,
    dto: JoinSessionDto,
  ): Promise<SessionParticipant> {
    // Check if same device is already in the session
    const existing = await this.sessionRepository.findParticipantByDeviceToken(
      session.id,
      dto.deviceToken,
    );
    if (existing) return existing;

    if (!isPerClientMode) {
      // Table mode: create or reuse the default participant
      const defaultParticipant = await this.sessionRepository.findDefaultParticipant(session.id);
      if (defaultParticipant) return defaultParticipant;

      const participant = SessionParticipant.create({
        sessionId: session.id,
        displayName: 'Mesa',
        deviceToken: dto.deviceToken,
        isDefault: true,
      });
      return this.sessionRepository.saveParticipant(participant);
    }

    // Per-client mode: displayName is required
    if (!dto.displayName) {
      throw new BusinessRuleViolationException(
        'displayName is required when order mode is per_client',
      );
    }

    const participant = SessionParticipant.create({
      sessionId: session.id,
      displayName: dto.displayName,
      deviceToken: dto.deviceToken,
      isDefault: false,
    });
    return this.sessionRepository.saveParticipant(participant);
  }
}
