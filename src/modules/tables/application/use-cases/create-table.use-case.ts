import { Inject, Injectable } from '@nestjs/common';
import { Table } from '../../domain/entities/table.entity';
import { ITableRepository, TABLE_REPOSITORY } from '../../domain/ports/table.repository.port';
import { CreateTableDto } from '../dtos/create-table.dto';

@Injectable()
export class CreateTableUseCase {
  constructor(
    @Inject(TABLE_REPOSITORY)
    private readonly tableRepository: ITableRepository,
  ) {}

  async execute(tenantId: string, dto: CreateTableDto): Promise<Table> {
    const table = Table.create({
      tenantId,
      label: dto.label,
      capacity: dto.capacity,
    });
    return this.tableRepository.save(table);
  }
}
