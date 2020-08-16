import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Client, ClientRelations, Transaction} from '../models';
import {TransactionRepository} from './transaction.repository';

export class ClientRepository extends DefaultCrudRepository<
  Client,
  typeof Client.prototype.id,
  ClientRelations
  > {

  public readonly transactions: HasManyRepositoryFactory<Transaction, typeof Client.prototype.id>;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource, @repository.getter('TransactionRepository') protected transactionRepositoryGetter: Getter<TransactionRepository>,
  ) {
    super(Client, dataSource);
    this.transactions = this.createHasManyRepositoryFactoryFor('transactions', transactionRepositoryGetter,);
    this.registerInclusionResolver('transactions', this.transactions.inclusionResolver);
  }
}
