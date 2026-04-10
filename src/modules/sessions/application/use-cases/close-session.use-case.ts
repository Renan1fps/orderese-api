import { Inject, Injectable } from '@nestjs/common';
import { ISessionRepository, SESSION_REPOSITORY } from '../../domain/ports/session.repository.port';
import { ITableRepository, TABLE_REPOSITORY } from '../../../tables/domain/ports/table.repository.port';
import { EntityNotFoundException } from '../../../../shared/exceptions/domain.exception';

@Injectable()
export class CloseSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
    @Inject(TABLE_REPOSITORY)
    private readonly tableRepository: ITableRepository,
  ) {}

  async execute(sessionId: string, tenantId: string): Promise<void> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session || session.tenantId !== tenantId) {
      throw new EntityNotFoundException('Session', sessionId);
    }

    session.close();
    await this.sessionRepository.saveSession(session);

    const table = await this.tableRepository.findById(session.tableId, tenantId);
    if (table) {
      table.markFree();
      await this.tableRepository.save(table);
    }
  }
}
