import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMenuRepository } from '../../domain/ports/menu.repository.port';
import { MenuCategory } from '../../domain/entities/menu-category.entity';
import { MenuItem } from '../../domain/entities/menu-item.entity';
import { MenuCategoryOrmEntity } from './menu-category.orm-entity';
import { MenuItemOrmEntity } from './menu-item.orm-entity';

@Injectable()
export class MenuRepository implements IMenuRepository {
  constructor(
    @InjectRepository(MenuCategoryOrmEntity)
    private readonly categoryOrm: Repository<MenuCategoryOrmEntity>,
    @InjectRepository(MenuItemOrmEntity)
    private readonly itemOrm: Repository<MenuItemOrmEntity>,
  ) {}

  async saveCategory(category: MenuCategory): Promise<MenuCategory> {
    const saved = await this.categoryOrm.save(this.categoryToOrm(category));
    return this.categoryToDomain(saved);
  }

  async findCategoriesByTenant(tenantId: string): Promise<MenuCategory[]> {
    const rows = await this.categoryOrm.findBy({ tenantId });
    return rows.map(this.categoryToDomain);
  }

  async findCategoryById(id: string, tenantId: string): Promise<MenuCategory | null> {
    const row = await this.categoryOrm.findOneBy({ id, tenantId });
    return row ? this.categoryToDomain(row) : null;
  }

  async saveItem(item: MenuItem): Promise<MenuItem> {
    const saved = await this.itemOrm.save(this.itemToOrm(item));
    return this.itemToDomain(saved);
  }

  async findItemById(id: string, tenantId: string): Promise<MenuItem | null> {
    const row = await this.itemOrm.findOneBy({ id, tenantId });
    return row ? this.itemToDomain(row) : null;
  }

  async findItemsByIds(ids: string[], tenantId: string): Promise<MenuItem[]> {
    const rows = await this.itemOrm
      .createQueryBuilder('item')
      .where('item.id IN (:...ids)', { ids })
      .andWhere('item.tenantId = :tenantId', { tenantId })
      .andWhere('item.available = true')
      .getMany();
    return rows.map(this.itemToDomain);
  }

  async findAvailableItemsByTenant(tenantId: string): Promise<MenuItem[]> {
    const rows = await this.itemOrm.findBy({ tenantId, available: true });
    return rows.map(this.itemToDomain);
  }

  private categoryToDomain(row: MenuCategoryOrmEntity): MenuCategory {
    return MenuCategory.reconstitute({ id: row.id, tenantId: row.tenantId, name: row.name, sortOrder: row.sortOrder });
  }

  private categoryToOrm(c: MenuCategory): MenuCategoryOrmEntity {
    const row = new MenuCategoryOrmEntity();
    row.id = c.id; row.tenantId = c.tenantId; row.name = c.name; row.sortOrder = c.sortOrder;
    return row;
  }

  private itemToDomain(row: MenuItemOrmEntity): MenuItem {
    return MenuItem.reconstitute({ id: row.id, categoryId: row.categoryId, tenantId: row.tenantId,
      name: row.name, description: row.description, price: Number(row.price), imageUrl: row.imageUrl, available: row.available });
  }

  private itemToOrm(i: MenuItem): MenuItemOrmEntity {
    const row = new MenuItemOrmEntity();
    row.id = i.id; row.categoryId = i.categoryId; row.tenantId = i.tenantId;
    row.name = i.name; row.description = i.description; row.price = i.price;
    row.imageUrl = i.imageUrl; row.available = i.available;
    return row;
  }
}
