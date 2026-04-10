import { Inject, Injectable } from '@nestjs/common';
import { IMenuRepository, MENU_REPOSITORY } from '../../domain/ports/menu.repository.port';
import { MenuCategory } from '../../domain/entities/menu-category.entity';
import { MenuItem } from '../../domain/entities/menu-item.entity';

export interface MenuWithItems {
  category: MenuCategory;
  items: MenuItem[];
}

@Injectable()
export class GetMenuUseCase {
  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async execute(tenantId: string): Promise<MenuWithItems[]> {
    const categories = await this.menuRepository.findCategoriesByTenant(tenantId);
    const items = await this.menuRepository.findAvailableItemsByTenant(tenantId);

    return categories.map((category) => ({
      category,
      items: items.filter((item) => item.categoryId === category.id),
    }));
  }
}
