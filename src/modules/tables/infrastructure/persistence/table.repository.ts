import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITableRepository } from '../../domain/ports/table.repository.port';
import { Table } from '../../domain/entities/table.entity';
import { TableOrmEntity } from './table.orm-entity';
import { TableStatus } from '../../domain/value-objects/table-status.vo';

@Injectable()
export class TableRepository implements ITableRepository {
  constructor(
    @InjectRepository(TableOrmEntity)
    private readonly orm: Repository<TableOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Table | null> {
    const row = await this.orm.findOneBy({ id, tenantId });
    return row ? this.toDomain(row) : null;
  }

  async findAllByTenant(tenantId: string): Promise<Table[]> {
    const rows = await this.orm.findBy({ tenantId });
    return rows.map(this.toDomain);
  }

  async findByQrToken(qrToken: string): Promise<Table | null> {
    const row = await this.orm.findOneBy({ qrToken });
    return row ? this.toDomain(row) : null;
  }

  async save(table: Table): Promise<Table> {
    const saved = await this.orm.save(this.toOrm(table));
    return this.toDomain(saved);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.orm.delete({ id, tenantId });
  }

  private toDomain(row: TableOrmEntity): Table {
    return Table.reconstitute({
      id: row.id,
      tenantId: row.tenantId,
      label: row.label,
      qrToken: row.qrToken,
      status: row.status as TableStatus,
      capacity: row.capacity,
    });
  }

  private toOrm(table: Table): TableOrmEntity {
    const row = new TableOrmEntity();
    row.id = table.id;
    row.tenantId = table.tenantId;
    row.label = table.label;
    row.qrToken = table.qrToken;
    row.status = table.status;
    row.capacity = table.capacity;
    return row;
  }
}
