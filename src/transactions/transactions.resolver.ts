import { Args, Float, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';
import { UseInterceptors } from '@nestjs/common';
import { ErrorInterceptor } from '../common/interceptors/error.interceptor';
import { TransactionLog, SystemLog } from '../common/interfaces/log.interface';

@Resolver(() => Transaction)
@UseInterceptors(ErrorInterceptor)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Mutation(() => Transaction)
  async registerPurchase(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('amount', { type: () => Float }) amount: number,
  ): Promise<Transaction> {
    return this.transactionsService.registerPurchase({ userId, amount });
  }

  @Mutation(() => Transaction)
  async redeemPoints(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('rewardId', { type: () => ID }) rewardId: string,
  ): Promise<Transaction> {
    return this.transactionsService.redeemPoints({ userId, rewardId });
  }

  @Query(() => [Transaction])
  async getUserHistory(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<Transaction[]> {
    return this.transactionsService.getUserHistory(userId);
  }

  @Query(() => [Transaction])
  async getTransactions(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @Query(() => [TransactionLog])
  async getTransactionLogs(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<TransactionLog[]> {
    return this.transactionsService.getTransactionLogs(userId);
  }

  @Query(() => [SystemLog])
  async getSystemLogs(): Promise<SystemLog[]> {
    return this.transactionsService.getSystemLogs();
  }
} 