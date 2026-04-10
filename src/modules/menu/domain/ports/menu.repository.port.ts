import { MenuCategory } from '../entities/menu-category.entity';
import { MenuItem } from '../entities/menu-item.entity';

export const MENU_REPOSITORY = Symbol('MENU_REPOSITORY');

export interface IMenuRepository {
  saveCategory(category: MenuCategory): Promise<MenuCategory>;
  findCategoriesByTenant(tenantId: string): Promise<MenuCategory[]>;
  findCategoryById(id: string, tenantId: string): Promise<MenuCategory | null>;

  saveItem(item: MenuItem): Promise<MenuItem>;
  findItemById(id: string, tenantId: string): Promise<MenuItem | null>;
  findItemsByIds(ids: string[], tenantId: string): Promise<MenuItem[]>;
  findAvailableItemsByTenant(tenantId: string): Promise<MenuItem[]>;
}
