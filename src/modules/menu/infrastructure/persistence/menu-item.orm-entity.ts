import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('menu_items')
export class MenuItemOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ default: true })
  available: boolean;
}
