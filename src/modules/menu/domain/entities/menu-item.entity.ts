import { Entity } from '../../../../shared/domain/entity.base';

export interface MenuItemProps {
  id: string;
  categoryId: string;
  tenantId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  available: boolean;
}

export class MenuItem extends Entity<MenuItemProps> {
  private constructor(props: MenuItemProps) {
    super(props);
  }

  static create(params: {
    categoryId: string;
    tenantId: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
  }): MenuItem {
    return new MenuItem({
      id: Entity.generateId(),
      categoryId: params.categoryId,
      tenantId: params.tenantId,
      name: params.name,
      description: params.description ?? null,
      price: params.price,
      imageUrl: params.imageUrl ?? null,
      available: true,
    });
  }

  static reconstitute(props: MenuItemProps): MenuItem {
    return new MenuItem(props);
  }

  get tenantId(): string { return this.props.tenantId; }
  get categoryId(): string { return this.props.categoryId; }
  get name(): string { return this.props.name; }
  get description(): string | null { return this.props.description; }
  get price(): number { return this.props.price; }
  get imageUrl(): string | null { return this.props.imageUrl; }
  get available(): boolean { return this.props.available; }

  toggleAvailability(): void {
    this.props.available = !this.props.available;
  }

  updatePrice(price: number): void {
    if (price < 0) throw new Error('Price cannot be negative');
    this.props.price = price;
  }
}
