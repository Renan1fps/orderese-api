import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('sessions')
export class SessionOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'table_id' })
  tableId: string;

  @Column({ default: 'open' })
  status: string;

  @CreateDateColumn({ name: 'opened_at', type: 'timestamptz' })
  openedAt: Date;

  @Column({ name: 'closed_at', type: 'timestamptz', nullable: true })
  closedAt: Date | null;
}
