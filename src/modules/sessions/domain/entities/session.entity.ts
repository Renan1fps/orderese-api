import { Entity } from '../../../../shared/domain/entity.base';
import { BusinessRuleViolationException } from '../../../../shared/exceptions/domain.exception';

export enum SessionStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export interface SessionProps {
  id: string;
  tenantId: string;
  tableId: string;
  status: SessionStatus;
  openedAt: Date;
  closedAt: Date | null;
}

export class Session extends Entity<SessionProps> {
  private constructor(props: SessionProps) {
    super(props);
  }

  static open(params: { tenantId: string; tableId: string }): Session {
    return new Session({
      id: Entity.generateId(),
      tenantId: params.tenantId,
      tableId: params.tableId,
      status: SessionStatus.OPEN,
      openedAt: new Date(),
      closedAt: null,
    });
  }

  static reconstitute(props: SessionProps): Session {
    return new Session(props);
  }

  get tenantId(): string { return this.props.tenantId; }
  get tableId(): string { return this.props.tableId; }
  get status(): SessionStatus { return this.props.status; }
  get openedAt(): Date { return this.props.openedAt; }
  get closedAt(): Date | null { return this.props.closedAt; }

  isOpen(): boolean {
    return this.props.status === SessionStatus.OPEN;
  }

  close(): void {
    if (!this.isOpen()) {
      throw new BusinessRuleViolationException('Session is already closed');
    }
    this.props.status = SessionStatus.CLOSED;
    this.props.closedAt = new Date();
  }
}
