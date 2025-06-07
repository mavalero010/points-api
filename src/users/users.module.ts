import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionLogSchema, SystemLogSchema } from '../common/schemas/log.schema';
import { MongoLoggerService } from '../common/services/mongo-logger.service';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([
      { name: 'TransactionLog', schema: TransactionLogSchema },
      { name: 'SystemLog', schema: SystemLogSchema },
    ]),
    forwardRef(() => TransactionsModule),
  ],
  providers: [UsersService, UsersResolver, MongoLoggerService],
  exports: [UsersService],
})
export class UsersModule {} 