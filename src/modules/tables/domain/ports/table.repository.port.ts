import { IRepository } from '../../../../shared/domain/repository.interface';
import { Table } from '../entities/table.entity';

export const TABLE_REPOSITORY = Symbol('TABLE_REPOSITORY');

export interface ITableRepository extends IRepository<Table> {
  findAllByTenant(tenantId: string): Promise<Table[]>;
  findByQrToken(qrToken: string): Promise<Table | null>;
}
