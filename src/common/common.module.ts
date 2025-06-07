import { Module } from '@nestjs/common';
import { MongoLoggerService } from './services/mongo-logger.service';
import { CloudFunctionService } from './services/cloud-function.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionLogSchema, SystemLogSchema } from './schemas/log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'TransactionLog', schema: TransactionLogSchema },
      { name: 'SystemLog', schema: SystemLogSchema },
    ]),
  ],
  providers: [MongoLoggerService, CloudFunctionService],
  exports: [MongoLoggerService, CloudFunctionService],
})
export class CommonModule {}
