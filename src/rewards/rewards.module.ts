import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from './entities/reward.entity';
import { RewardsService } from './rewards.service';
import { RewardsResolver } from './rewards.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionLogSchema, SystemLogSchema } from '../common/schemas/log.schema';
import { MongoLoggerService } from '../common/services/mongo-logger.service';
import { UsersModule } from '../users/users.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reward]),
    MongooseModule.forFeature([
      { name: 'TransactionLog', schema: TransactionLogSchema },
      { name: 'SystemLog', schema: SystemLogSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => TransactionsModule),
  ],
  providers: [RewardsService, RewardsResolver, MongoLoggerService],
  exports: [RewardsService],
})
export class RewardsModule {} 