import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {basicAuthorization} from '../middlewares/auth.midd';
import {Client, Transaction} from '../models';
import {ClientRepository} from '../repositories';

@authenticate('jwt')
@authorize({
  allowedRoles: ['user'],
  voters: [basicAuthorization],
})
export class UserTransactionController {
  constructor(
    @repository(ClientRepository) protected clientRepository: ClientRepository,
  ) {}

  @get('/users/{id}/transactions', {
    responses: {
      '200': {
        description: 'Array of User has many Transaction',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Transaction)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Transaction>,
  ): Promise<Transaction[]> {
    return this.clientRepository.transactions(id).find(filter);
  }

  @post('/users/{id}/transactions', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Transaction)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Client.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {
            title: 'NewTransactionInUser',
            exclude: ['id'],
            optional: ['client']
          }),
        },
      },
    }) transaction: Omit<Transaction, 'id'>,
  ): Promise<{count: number, average: number, transaction: Transaction}> {

    console.log(transaction);

    transaction = await this.clientRepository.transactions(id).create(transaction);

    const client = await this.clientRepository.findById(id);

    client.count = client.count ? client.count + 1 : 1;

    if (!client.average || client.count === 0)
      client.average = transaction.value;
    else
      client.average = (client.average + transaction.value) / 2;

    if (client.count === 6) {
      client.count = 0;
    }

    await this.clientRepository.update(client);

    return {count: client.count, average: client.average, transaction};
  }

  @patch('/users/{id}/transactions', {
    responses: {
      '200': {
        description: 'User.Transaction PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {partial: true}),
        },
      },
    })
    transaction: Partial<Transaction>,
    @param.query.object('where', getWhereSchemaFor(Transaction)) where?: Where<Transaction>,
  ): Promise<Count> {
    return this.clientRepository.transactions(id).patch(transaction, where);
  }

  @del('/users/{id}/transactions', {
    responses: {
      '200': {
        description: 'User.Transaction DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Transaction)) where?: Where<Transaction>,
  ): Promise<Count> {
    return this.clientRepository.transactions(id).delete(where);
  }
}
