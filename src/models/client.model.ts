import {Entity, hasMany, model, property} from '@loopback/repository';
import {Transaction} from './transaction.model';

@model()
export class Client extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  fullName: string;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;

  @property({
    type: 'number',
    default: 0,
  })
  average?: number;

  @property({
    type: 'number',
    default: 0,
  })
  count?: number;

  @hasMany(() => Transaction, {keyTo: 'client'})
  transactions: Transaction[];

  constructor(data?: Partial<Client>) {
    super(data);
  }
}

export interface ClientRelations {
  // describe navigational properties here
}

export type ClientWithRelations = Client & ClientRelations;
