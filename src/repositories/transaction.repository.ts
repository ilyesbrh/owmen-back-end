import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostegressConnectorDataSource} from '../datasources';
import {Transaction, TransactionRelations} from '../models';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.id,
  TransactionRelations
  > {
  constructor(
    @inject('datasources.postegressConnector') dataSource: PostegressConnectorDataSource,
  ) {
    super(Transaction, dataSource);
  }
}
