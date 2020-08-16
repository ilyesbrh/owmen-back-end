import {DefaultCrudRepository} from '@loopback/repository';
import {Transaction, TransactionRelations} from '../models';
import {MysqlDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.id,
  TransactionRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(Transaction, dataSource);
  }
}
