import { Inject, Injectable } from '@nestjs/common';
import { Table } from '../../domain/entities/table.entity';
import { ITableRepository, TABLE_REPOSITORY } from '../../domain/ports/table.repository.port';
import { EntityNotFoundException } from '../../../../shared/exceptions/domain.exception';

@Injectable()
export class GetTableByQrUseCase {
  constructor(
    @Inject(TABLE_REPOSITORY)
    private readonly tableRepository: ITableRepository,
  ) {}

  async execute(qrToken: string): Promise<Table> {
    const table = await this.tableRepository.findByQrToken(qrToken);
    if (!table) throw new EntityNotFoundException('Table', qrToken);
    return table;
  }
}
