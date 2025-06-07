import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Reward } from './entities/reward.entity';
import { RewardsService } from './rewards.service';
import { CreateRewardInput } from './dto/create-reward.input';
import { UseInterceptors } from '@nestjs/common';
import { ErrorInterceptor } from '../common/interceptors/error.interceptor';

@Resolver(() => Reward)
@UseInterceptors(ErrorInterceptor)
export class RewardsResolver {
  constructor(private readonly rewardsService: RewardsService) {}

  @Query(() => [Reward])
  async getRewards(): Promise<Reward[]> {
    return this.rewardsService.findAll();
  }

  @Query(() => Reward)
  async getReward(@Args('id', { type: () => ID }) id: string): Promise<Reward> {
    return this.rewardsService.findOne(id);
  }

  @Query(() => [Reward])
  async getAvailableRewards(@Args('userId', { type: () => ID }) userId: string): Promise<Reward[]> {
    return this.rewardsService.getAvailableRewards(userId);
  }

  @Mutation(() => Reward)
  async createReward(@Args('input') input: CreateRewardInput): Promise<Reward> {
    return this.rewardsService.create(input);
  }

  @Mutation(() => Reward)
  async updateReward(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: CreateRewardInput,
  ): Promise<Reward> {
    return this.rewardsService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteReward(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.rewardsService.remove(id);
    return true;
  }
}
