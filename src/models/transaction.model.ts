import {Entity, model, property} from '@loopback/repository';

@model()
export class Transaction extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;
  @property({
    type: 'string',
    required: true,
  })
  perfume: string;
  @property({
    type: 'string',
    required: true,
  })
  value: string;

  @property({
    type: 'number',
    required: true,
  })
  client: number;


  constructor(data?: Partial<Transaction>) {
    super(data);
  }
}

export interface TransactionRelations {
  // describe navigational properties here
}

export type TransactionWithRelations = Transaction & TransactionRelations;
