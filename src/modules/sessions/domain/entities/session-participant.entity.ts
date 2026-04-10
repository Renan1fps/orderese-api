import { Entity } from '../../../../shared/domain/entity.base';

export interface SessionParticipantProps {
  id: string;
  sessionId: string;
  displayName: string;
  deviceToken: string;
  isDefault: boolean;
  joinedAt: Date;
}

export class SessionParticipant extends Entity<SessionParticipantProps> {
  private constructor(props: SessionParticipantProps) {
    super(props);
  }

  static create(params: {
    sessionId: string;
    displayName: string;
    deviceToken: string;
    isDefault?: boolean;
  }): SessionParticipant {
    return new SessionParticipant({
      id: Entity.generateId(),
      sessionId: params.sessionId,
      displayName: params.displayName,
      deviceToken: params.deviceToken,
      isDefault: params.isDefault ?? false,
      joinedAt: new Date(),
    });
  }

  static reconstitute(props: SessionParticipantProps): SessionParticipant {
    return new SessionParticipant(props);
  }

  get sessionId(): string { return this.props.sessionId; }
  get displayName(): string { return this.props.displayName; }
  get deviceToken(): string { return this.props.deviceToken; }
  get isDefault(): boolean { return this.props.isDefault; }
  get joinedAt(): Date { return this.props.joinedAt; }
}
