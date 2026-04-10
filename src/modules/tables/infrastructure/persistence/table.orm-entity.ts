import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tables')
export class TableOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column()
  label: string;

  @Column({ name: 'qr_token', unique: true })
  qrToken: string;

  @Column({ default: 'free' })
  status: string;

  @Column({ default: 4 })
  capacity: number;
}
