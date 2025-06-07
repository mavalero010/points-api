import { Transaction, TransactionType } from '../entities/transaction.entity';

export interface TransactionModel {
  id: string;
  userId: string;
  type: TransactionType;
  points: number;
  date: Date;
  description?: string;
  reference?: string;
}

export class TransactionMapper {
  static toEntity(model: TransactionModel): Transaction {
    const transaction = new Transaction();

    transaction.id = model.id;
    transaction.userId = model.userId;
    transaction.type = model.type;
    transaction.points = model.points;
    transaction.date = model.date;
    transaction.description = model.description;
    transaction.reference = model.reference;

    return transaction;
  }

  static toModel(entity: Transaction): TransactionModel {
    return {
      id: entity.id,
      userId: entity.userId,
      type: entity.type,
      points: entity.points,
      date: entity.date,
      description: entity.description,
      reference: entity.reference,
    };
  }

  static toEntityArray(models: TransactionModel[]): Transaction[] {
    return models.map((model) => this.toEntity(model));
  }

  static toModelArray(entities: Transaction[]): TransactionModel[] {
    return entities.map((entity) => this.toModel(entity));
  }

  static toPartialEntity(partialModel: Partial<TransactionModel>): Partial<Transaction> {
    const transaction: Partial<Transaction> = {};

    if (partialModel.id !== undefined) transaction.id = partialModel.id;
    if (partialModel.userId !== undefined) transaction.userId = partialModel.userId;
    if (partialModel.type !== undefined) transaction.type = partialModel.type;
    if (partialModel.points !== undefined) transaction.points = partialModel.points;
    if (partialModel.date !== undefined) transaction.date = partialModel.date;
    if (partialModel.description !== undefined) transaction.description = partialModel.description;
    if (partialModel.reference !== undefined) transaction.reference = partialModel.reference;

    return transaction;
  }
}
