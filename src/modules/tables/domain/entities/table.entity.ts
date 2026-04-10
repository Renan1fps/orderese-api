import { v4 as uuid } from 'uuid';
import { Entity } from '../../../../shared/domain/entity.base';
import { TableStatus } from '../value-objects/table-status.vo';

export interface TableProps {
  id: string;
  tenantId: string;
  label: string;
  qrToken: string;
  status: TableStatus;
  capacity: number;
}

export class Table extends Entity<TableProps> {
  private constructor(props: TableProps) {
    super(props);
  }

  static create(params: {
    tenantId: string;
    label: string;
    capacity?: number;
  }): Table {
    return new Table({
      id: Entity.generateId(),
      tenantId: params.tenantId,
      label: params.label,
      qrToken: uuid(),
      status: TableStatus.FREE,
      capacity: params.capacity ?? 4,
    });
  }

  static reconstitute(props: TableProps): Table {
    return new Table(props);
  }

  get tenantId(): string { return this.props.tenantId; }
  get label(): string { return this.props.label; }
  get qrToken(): string { return this.props.qrToken; }
  get status(): TableStatus { return this.props.status; }
  get capacity(): number { return this.props.capacity; }

  markOccupied(): void {
    this.props.status = TableStatus.OCCUPIED;
  }

  markFree(): void {
    this.props.status = TableStatus.FREE;
  }

  isFree(): boolean {
    return this.props.status === TableStatus.FREE;
  }

  regenerateQrToken(): void {
    this.props.qrToken = uuid();
  }
}
