import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseLog, SystemLog, TransactionLog } from '../interfaces/log.interface';

@Injectable()
export class MongoLoggerService {
  constructor(
    @InjectModel('TransactionLog')
    private transactionLogModel: Model<TransactionLog>,
    @InjectModel('SystemLog')
    private systemLogModel: Model<SystemLog>,
  ) {}

  async logTransaction(log: Omit<TransactionLog, 'timestamp'>) {
    const newLog = new this.transactionLogModel({
      ...log,
      timestamp: new Date(),
    });
    await newLog.save();
  }

  async logSystemEvent(log: Omit<SystemLog, 'timestamp'>) {
    const newLog = new this.systemLogModel({
      ...log,
      timestamp: new Date(),
    });
    await newLog.save();
  }

  async getTransactionLogs(userId: string) {
    return this.transactionLogModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(100)
      .exec();
  }

  async getSystemLogs() {
    return this.systemLogModel
      .find()
      .sort({ timestamp: -1 })
      .limit(100)
      .exec();
  }
} 