import { Inject, Injectable } from '@nestjs/common';
import { MenuCategory } from '../../domain/entities/menu-category.entity';
import { IMenuRepository, MENU_REPOSITORY } from '../../domain/ports/menu.repository.port';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async execute(tenantId: string, dto: CreateCategoryDto): Promise<MenuCategory> {
    const category = MenuCategory.create({
      tenantId,
      name: dto.name,
      sortOrder: dto.sortOrder,
    });
    return this.menuRepository.saveCategory(category);
  }
}
