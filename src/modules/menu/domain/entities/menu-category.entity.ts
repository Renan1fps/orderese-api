import { Entity } from '../../../../shared/domain/entity.base';

export interface MenuCategoryProps {
  id: string;
  tenantId: string;
  name: string;
  sortOrder: number;
}

export class MenuCategory extends Entity<MenuCategoryProps> {
  private constructor(props: MenuCategoryProps) {
    super(props);
  }

  static create(params: { tenantId: string; name: string; sortOrder?: number }): MenuCategory {
    return new MenuCategory({
      id: Entity.generateId(),
      tenantId: params.tenantId,
      name: params.name,
      sortOrder: params.sortOrder ?? 0,
    });
  }

  static reconstitute(props: MenuCategoryProps): MenuCategory {
    return new MenuCategory(props);
  }

  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get sortOrder(): number { return this.props.sortOrder; }
}
