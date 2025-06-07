import { User } from '../entities/user.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

export interface UserModel {
  id: string;
  name: string;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
  transactions?: Transaction[];
}

export class UserMapper {
  static toEntity(model: UserModel): User {
    const user = new User();

    user.id = model.id;
    user.name = model.name;
    user.totalPoints = model.totalPoints;
    user.createdAt = model.createdAt;
    user.updatedAt = model.updatedAt;
    user.transactions = model.transactions ?? [];

    return user;
  }

  static toModel(entity: User): UserModel {
    return {
      id: entity.id,
      name: entity.name,
      totalPoints: entity.totalPoints,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      transactions: entity.transactions,
    };
  }

  static toEntityArray(models: UserModel[]): User[] {
    return models.map((model) => this.toEntity(model));
  }

  static toModelArray(entities: User[]): UserModel[] {
    return entities.map((entity) => this.toModel(entity));
  }

  static toPartialEntity(partialModel: Partial<UserModel>): Partial<User> {
    const user: Partial<User> = {};

    if (partialModel.id !== undefined) user.id = partialModel.id;
    if (partialModel.name !== undefined) user.name = partialModel.name;
    if (partialModel.totalPoints !== undefined) user.totalPoints = partialModel.totalPoints;
    if (partialModel.createdAt !== undefined) user.createdAt = partialModel.createdAt;
    if (partialModel.updatedAt !== undefined) user.updatedAt = partialModel.updatedAt;
    if (partialModel.transactions !== undefined) user.transactions = partialModel.transactions;

    return user;
  }
}
