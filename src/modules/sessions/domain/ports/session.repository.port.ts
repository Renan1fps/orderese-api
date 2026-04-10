import { Session } from '../entities/session.entity';
import { SessionParticipant } from '../entities/session-participant.entity';

export const SESSION_REPOSITORY = Symbol('SESSION_REPOSITORY');

export interface ISessionRepository {
  findOpenSessionByTableId(tableId: string): Promise<Session | null>;
  findById(id: string): Promise<Session | null>;
  saveSession(session: Session): Promise<Session>;

  findParticipantByDeviceToken(sessionId: string, deviceToken: string): Promise<SessionParticipant | null>;
  findDefaultParticipant(sessionId: string): Promise<SessionParticipant | null>;
  saveParticipant(participant: SessionParticipant): Promise<SessionParticipant>;
  findParticipantById(id: string): Promise<SessionParticipant | null>;
}
