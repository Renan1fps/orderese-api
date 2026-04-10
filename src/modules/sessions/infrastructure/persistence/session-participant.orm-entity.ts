import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('session_participants')
export class SessionParticipantOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'display_name' })
  displayName: string;

  @Column({ name: 'device_token' })
  deviceToken: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @CreateDateColumn({ name: 'joined_at', type: 'timestamptz' })
  joinedAt: Date;
}
