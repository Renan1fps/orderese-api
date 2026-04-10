import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('order_items')
export class OrderItemOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ name: 'menu_item_id' })
  menuItemId: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;
}
