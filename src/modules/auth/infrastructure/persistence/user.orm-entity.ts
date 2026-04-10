import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ default: 'owner' })
  role: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
