import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('orders')
export class OrderOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'participant_id' })
  participantId: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
