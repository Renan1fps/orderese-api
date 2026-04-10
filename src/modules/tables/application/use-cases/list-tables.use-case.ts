import { Inject, Injectable } from '@nestjs/common';
import { Table } from '../../domain/entities/table.entity';
import { ITableRepository, TABLE_REPOSITORY } from '../../domain/ports/table.repository.port';

@Injectable()
export class ListTablesUseCase {
  constructor(
    @Inject(TABLE_REPOSITORY)
    private readonly tableRepository: ITableRepository,
  ) {}

  async execute(tenantId: string): Promise<Table[]> {
    return this.tableRepository.findAllByTenant(tenantId);
  }
}
