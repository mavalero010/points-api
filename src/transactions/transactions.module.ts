import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { User } from '../users/entities/user.entity';
import { Reward } from '../rewards/entities/reward.entity';
import { UsersModule } from '../users/users.module';
import { RewardsModule } from '../rewards/rewards.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionLogSchema, SystemLogSchema } from '../common/schemas/log.schema';
import { MongoLoggerService } from '../common/services/mongo-logger.service';
import { CloudFunctionService } from '../common/services/cloud-function.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Reward]),
    forwardRef(() => UsersModule),
    forwardRef(() => RewardsModule),
    MongooseModule.forFeature([
      { name: 'TransactionLog', schema: TransactionLogSchema },
      { name: 'SystemLog', schema: SystemLogSchema },
    ]),
  ],
  providers: [TransactionsService, TransactionsResolver, MongoLoggerService, CloudFunctionService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
