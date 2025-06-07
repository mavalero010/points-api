import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from './entities/reward.entity';
import { RewardsService } from './rewards.service';
import { RewardsResolver } from './rewards.resolver';
import { UsersModule } from '../users/users.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reward]),
    forwardRef(() => UsersModule),
    forwardRef(() => TransactionsModule),
    CommonModule,
  ],
  providers: [RewardsService, RewardsResolver],
  exports: [RewardsService],
})
export class RewardsModule {}
