import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UseInterceptors } from '@nestjs/common';
import { ErrorInterceptor } from '../common/interceptors/error.interceptor';
import { UserPointsResponse } from './dto/user-points.response';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => User)
@UseInterceptors(ErrorInterceptor)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Mutation(() => User)
  async createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(input);
  }

  @Query(() => UserPointsResponse)
  async getUserPoints(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<UserPointsResponse> {
    const user = await this.usersService.findOne(userId);
    return {
      id: user.id,
      name: user.name,
      totalPoints: user.totalPoints,
      updatedAt: user.updatedAt,
    };
  }

  @Query(() => [Transaction])
  async getUserHistory(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<Transaction[]> {
    // Verificar que el usuario existe
    await this.usersService.findOne(userId);
    return this.transactionsService.getUserHistory(userId);
  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }
} 