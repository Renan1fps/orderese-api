import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/infrastructure/guards/jwt-auth.guard';
import { CreateTableUseCase } from '../../application/use-cases/create-table.use-case';
import { ListTablesUseCase } from '../../application/use-cases/list-tables.use-case';
import { GetTableByQrUseCase } from '../../application/use-cases/get-table-by-qr.use-case';
import { CreateTableDto } from '../../application/dtos/create-table.dto';

@ApiTags('Tables')
@Controller('tenants/:tenantId/tables')
export class TableController {
  constructor(
    private readonly createTable: CreateTableUseCase,
    private readonly listTables: ListTablesUseCase,
    private readonly getByQr: GetTableByQrUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a table for a tenant' })
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateTableDto) {
    return this.createTable.execute(tenantId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all tables for a tenant' })
  list(@Param('tenantId') tenantId: string) {
    return this.listTables.execute(tenantId);
  }

  @Get('qr/:qrToken')
  @ApiOperation({ summary: 'Resolve table by QR token (public, used by PWA)' })
  findByQr(@Param('qrToken') qrToken: string) {
    return this.getByQr.execute(qrToken);
  }
}
