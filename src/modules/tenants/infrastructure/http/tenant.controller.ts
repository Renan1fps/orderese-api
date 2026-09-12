import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTenantUseCase } from '../../application/use-cases/create-tenant.use-case';
import { GetTenantUseCase } from '../../application/use-cases/get-tenant.use-case';
import { CreateTenantDto } from '../../application/dtos/create-tenant.dto';
import { JwtAuthGuard } from '@shared/infrastructure/guards/jwt-auth.guard';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantController {
  constructor(
    private readonly createTenant: CreateTenantUseCase,
    private readonly getTenant: GetTenantUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new tenant (onboarding)' })
  create(@Body() dto: CreateTenantDto) {
    return this.createTenant.execute(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tenant by id' })
  findById(@Param('id') id: string) {
    return this.getTenant.byId(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get tenant by slug (public, used by PWA)' })
  findBySlug(@Param('slug') slug: string) {
    return this.getTenant.bySlug(slug);
  }
}
