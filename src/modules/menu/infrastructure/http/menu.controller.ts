import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/infrastructure/guards/jwt-auth.guard';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { CreateMenuItemUseCase } from '../../application/use-cases/create-menu-item.use-case';
import { GetMenuUseCase } from '../../application/use-cases/get-menu.use-case';
import { CreateCategoryDto } from '../../application/dtos/create-category.dto';
import { CreateMenuItemDto } from '../../application/dtos/create-menu-item.dto';

@ApiTags('Menu')
@Controller('tenants/:tenantId/menu')
export class MenuController {
  constructor(
    private readonly createCategory: CreateCategoryUseCase,
    private readonly createItem: CreateMenuItemUseCase,
    private readonly getMenu: GetMenuUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get full menu (public, used by PWA)' })
  list(@Param('tenantId') tenantId: string) {
    return this.getMenu.execute(tenantId);
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create menu category' })
  addCategory(@Param('tenantId') tenantId: string, @Body() dto: CreateCategoryDto) {
    return this.createCategory.execute(tenantId, dto);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create menu item' })
  addItem(@Param('tenantId') tenantId: string, @Body() dto: CreateMenuItemDto) {
    return this.createItem.execute(tenantId, dto);
  }
}
