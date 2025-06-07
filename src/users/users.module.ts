import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TransactionsModule } from '../transactions/transactions.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => TransactionsModule), CommonModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
