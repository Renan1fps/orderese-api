import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableOrmEntity } from './infrastructure/persistence/table.orm-entity';
import { TableRepository } from './infrastructure/persistence/table.repository';
import { TABLE_REPOSITORY } from './domain/ports/table.repository.port';
import { CreateTableUseCase } from './application/use-cases/create-table.use-case';
import { ListTablesUseCase } from './application/use-cases/list-tables.use-case';
import { GetTableByQrUseCase } from './application/use-cases/get-table-by-qr.use-case';
import { TableController } from './infrastructure/http/table.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TableOrmEntity])],
  controllers: [TableController],
  providers: [
    { provide: TABLE_REPOSITORY, useClass: TableRepository },
    CreateTableUseCase,
    ListTablesUseCase,
    GetTableByQrUseCase,
  ],
  exports: [GetTableByQrUseCase, TABLE_REPOSITORY],
})
export class TableModule {}
