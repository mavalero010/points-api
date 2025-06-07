import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Reward } from './entities/reward.entity';
import { CreateRewardInput } from './dto/create-reward.input';
import { UpdateRewardInput } from './dto/update-reward.input';
import { MongoLoggerService } from '../common/services/mongo-logger.service';
import { UsersService } from '../users/users.service';
import { TransactionsService } from '../transactions/transactions.service';
import { isUUID } from 'class-validator';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    private readonly logger: MongoLoggerService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
  ) {}

  async findAll(): Promise<Reward[]> {
    return this.rewardRepository.find({
      order: {
        pointsCost: 'ASC',
      },
    });
  }

  async create(input: CreateRewardInput): Promise<Reward> {
    const reward = this.rewardRepository.create(input);
    const savedReward = await this.rewardRepository.save(reward);

    await this.logger.logSystemEvent({
      level: 'info',
      message: `Nueva recompensa creada: ${reward.name}`,
      component: 'RewardsService',
      action: 'create',
      success: true,
      metadata: { rewardId: savedReward.id, pointsCost: reward.pointsCost },
    });

    return savedReward;
  }

  async findOne(id: string): Promise<Reward> {
    if (!isUUID(id)) {
      const error = new NotFoundException(`Recompensa con ID ${id} no encontrada`);
      error.name = 'NotFoundException';
      throw error;
    }

    const reward = await this.rewardRepository.findOne({
      where: { id },
    });

    if (!reward) {
      const error = new NotFoundException(`Recompensa con ID ${id} no encontrada`);
      error.name = 'NotFoundException';
      throw error;
    }

    return reward;
  }

  async getAvailableRewards(userId: string): Promise<Reward[]> {
    const user = await this.usersService.findOne(userId);
    const availableRewards = await this.rewardRepository.find({
      where: {
        isActive: true,
        pointsCost: LessThanOrEqual(user.totalPoints),
      },
      order: {
        pointsCost: 'ASC',
      },
    });

    await this.logger.logSystemEvent({
      level: 'info',
      message: `Recompensas disponibles consultadas para usuario: ${userId}`,
      component: 'RewardsService',
      action: 'getAvailableRewards',
      success: true,
      metadata: {
        userId,
        availableCount: availableRewards.length,
        userPoints: user.totalPoints,
      },
    });

    return availableRewards;
  }

  async update(id: string, input: UpdateRewardInput): Promise<Reward> {
    const reward = await this.findOne(id);
    Object.assign(reward, input);

    const updatedReward = await this.rewardRepository.save(reward);

    await this.logger.logSystemEvent({
      level: 'info',
      message: `Recompensa actualizada: ${reward.name}`,
      component: 'RewardsService',
      action: 'update',
      success: true,
      metadata: { rewardId: id, changes: input },
    });

    return updatedReward;
  }

  async remove(id: string): Promise<boolean> {
    const reward = await this.findOne(id);
    await this.rewardRepository.remove(reward);

    await this.logger.logSystemEvent({
      level: 'info',
      message: `Recompensa eliminada: ${reward.name}`,
      component: 'RewardsService',
      action: 'remove',
      success: true,
      metadata: { rewardId: id },
    });

    return true;
  }
}
