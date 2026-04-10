import { Inject, Injectable } from '@nestjs/common';
import { MenuItem } from '../../domain/entities/menu-item.entity';
import { IMenuRepository, MENU_REPOSITORY } from '../../domain/ports/menu.repository.port';
import { CreateMenuItemDto } from '../dtos/create-menu-item.dto';
import { EntityNotFoundException } from '../../../../shared/exceptions/domain.exception';

@Injectable()
export class CreateMenuItemUseCase {
  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async execute(tenantId: string, dto: CreateMenuItemDto): Promise<MenuItem> {
    const category = await this.menuRepository.findCategoryById(dto.categoryId, tenantId);
    if (!category) throw new EntityNotFoundException('MenuCategory', dto.categoryId);

    const item = MenuItem.create({
      categoryId: dto.categoryId,
      tenantId,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      imageUrl: dto.imageUrl,
    });
    return this.menuRepository.saveItem(item);
  }
}
