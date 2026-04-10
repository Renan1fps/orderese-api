import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuCategoryOrmEntity } from './infrastructure/persistence/menu-category.orm-entity';
import { MenuItemOrmEntity } from './infrastructure/persistence/menu-item.orm-entity';
import { MenuRepository } from './infrastructure/persistence/menu.repository';
import { MENU_REPOSITORY } from './domain/ports/menu.repository.port';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { CreateMenuItemUseCase } from './application/use-cases/create-menu-item.use-case';
import { GetMenuUseCase } from './application/use-cases/get-menu.use-case';
import { MenuController } from './infrastructure/http/menu.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MenuCategoryOrmEntity, MenuItemOrmEntity])],
  controllers: [MenuController],
  providers: [
    { provide: MENU_REPOSITORY, useClass: MenuRepository },
    CreateCategoryUseCase,
    CreateMenuItemUseCase,
    GetMenuUseCase,
  ],
  exports: [MENU_REPOSITORY],
})
export class MenuModule {}
