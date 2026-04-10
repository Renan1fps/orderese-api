import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('tenants')
export class TenantOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'order_mode', default: 'table' })
  orderMode: string;

  @Column({ name: 'subscription_status', default: 'trial' })
  subscriptionStatus: string;

  @Column({ name: 'gateway_name', type: 'varchar', nullable: true })
  gatewayName: string | null;

  @Column({ name: 'gateway_customer_id', type: 'varchar', nullable: true })
  gatewayCustomerId: string | null;

  @Column({ name: 'gateway_subscription_id', type: 'varchar', nullable: true })
  gatewaySubscriptionId: string | null;

  @Column({ name: 'subscription_expires_at', type: 'timestamptz', nullable: true })
  subscriptionExpiresAt: Date | null;

  @Column({ name: 'trial_ends_at', type: 'timestamptz', nullable: true })
  trialEndsAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
