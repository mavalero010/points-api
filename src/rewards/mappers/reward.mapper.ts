import { Reward } from '../entities/reward.entity';

export interface RewardModel {
  id: string;
  name: string;
  description?: string;
  pointsCost: number;
  isActive: boolean;
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class RewardMapper {
  static toEntity(model: RewardModel): Reward {
    const reward = new Reward();

    reward.id = model.id;
    reward.name = model.name;
    reward.description = model.description;
    reward.pointsCost = model.pointsCost;
    reward.isActive = model.isActive;
    reward.stock = model.stock;
    reward.createdAt = model.createdAt;
    reward.updatedAt = model.updatedAt;

    return reward;
  }

  static toModel(entity: Reward): RewardModel {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      pointsCost: entity.pointsCost,
      isActive: entity.isActive,
      stock: entity.stock,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toEntityArray(models: RewardModel[]): Reward[] {
    return models.map((model) => this.toEntity(model));
  }

  static toModelArray(entities: Reward[]): RewardModel[] {
    return entities.map((entity) => this.toModel(entity));
  }

  static toPartialEntity(partialModel: Partial<RewardModel>): Partial<Reward> {
    const reward: Partial<Reward> = {};

    if (partialModel.id !== undefined) reward.id = partialModel.id;
    if (partialModel.name !== undefined) reward.name = partialModel.name;
    if (partialModel.description !== undefined) reward.description = partialModel.description;
    if (partialModel.pointsCost !== undefined) reward.pointsCost = partialModel.pointsCost;
    if (partialModel.isActive !== undefined) reward.isActive = partialModel.isActive;
    if (partialModel.stock !== undefined) reward.stock = partialModel.stock;
    if (partialModel.createdAt !== undefined) reward.createdAt = partialModel.createdAt;
    if (partialModel.updatedAt !== undefined) reward.updatedAt = partialModel.updatedAt;

    return reward;
  }
}
