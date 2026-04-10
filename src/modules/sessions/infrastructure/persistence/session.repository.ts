import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISessionRepository } from '../../domain/ports/session.repository.port';
import { Session, SessionStatus } from '../../domain/entities/session.entity';
import { SessionParticipant } from '../../domain/entities/session-participant.entity';
import { SessionOrmEntity } from './session.orm-entity';
import { SessionParticipantOrmEntity } from './session-participant.orm-entity';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(
    @InjectRepository(SessionOrmEntity)
    private readonly sessionOrm: Repository<SessionOrmEntity>,
    @InjectRepository(SessionParticipantOrmEntity)
    private readonly participantOrm: Repository<SessionParticipantOrmEntity>,
  ) {}

  async findOpenSessionByTableId(tableId: string): Promise<Session | null> {
    const row = await this.sessionOrm.findOneBy({ tableId, status: 'open' });
    return row ? this.sessionToDomain(row) : null;
  }

  async findById(id: string): Promise<Session | null> {
    const row = await this.sessionOrm.findOneBy({ id });
    return row ? this.sessionToDomain(row) : null;
  }

  async saveSession(session: Session): Promise<Session> {
    const saved = await this.sessionOrm.save(this.sessionToOrm(session));
    return this.sessionToDomain(saved);
  }

  async findParticipantByDeviceToken(sessionId: string, deviceToken: string): Promise<SessionParticipant | null> {
    const row = await this.participantOrm.findOneBy({ sessionId, deviceToken });
    return row ? this.participantToDomain(row) : null;
  }

  async findDefaultParticipant(sessionId: string): Promise<SessionParticipant | null> {
    const row = await this.participantOrm.findOneBy({ sessionId, isDefault: true });
    return row ? this.participantToDomain(row) : null;
  }

  async saveParticipant(participant: SessionParticipant): Promise<SessionParticipant> {
    const saved = await this.participantOrm.save(this.participantToOrm(participant));
    return this.participantToDomain(saved);
  }

  async findParticipantById(id: string): Promise<SessionParticipant | null> {
    const row = await this.participantOrm.findOneBy({ id });
    return row ? this.participantToDomain(row) : null;
  }

  private sessionToDomain(row: SessionOrmEntity): Session {
    return Session.reconstitute({ id: row.id, tenantId: row.tenantId, tableId: row.tableId,
      status: row.status as SessionStatus, openedAt: row.openedAt, closedAt: row.closedAt });
  }

  private sessionToOrm(s: Session): SessionOrmEntity {
    const row = new SessionOrmEntity();
    row.id = s.id; row.tenantId = s.tenantId; row.tableId = s.tableId;
    row.status = s.status; row.openedAt = s.openedAt; row.closedAt = s.closedAt;
    return row;
  }

  private participantToDomain(row: SessionParticipantOrmEntity): SessionParticipant {
    return SessionParticipant.reconstitute({ id: row.id, sessionId: row.sessionId,
      displayName: row.displayName, deviceToken: row.deviceToken, isDefault: row.isDefault, joinedAt: row.joinedAt });
  }

  private participantToOrm(p: SessionParticipant): SessionParticipantOrmEntity {
    const row = new SessionParticipantOrmEntity();
    row.id = p.id; row.sessionId = p.sessionId; row.displayName = p.displayName;
    row.deviceToken = p.deviceToken; row.isDefault = p.isDefault; row.joinedAt = p.joinedAt;
    return row;
  }
}
