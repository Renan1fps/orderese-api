import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('menu_categories')
export class MenuCategoryOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column()
  name: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
