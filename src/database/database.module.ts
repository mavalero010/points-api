import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Reward } from '../rewards/entities/reward.entity';
import { TransactionLogSchema } from '../common/schemas/log.schema';
import { SystemLogSchema } from '../common/schemas/log.schema';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('TypeOrmModule');
        
        const config = {
          type: 'postgres' as const,
          host: configService.get('DB_HOST') || 'localhost',
          port: parseInt(configService.get('DB_PORT') || '5432', 10),
          username: configService.get('DB_USERNAME') || 'postgres',
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME') || 'points_db',
          entities: [User, Transaction, Reward],
          autoLoadEntities: true,
          synchronize: configService.get('NODE_ENV') !== 'production',
          logging: configService.get('NODE_ENV') !== 'production',
        };

        logger.debug('TypeORM Config:', {
          type: config.type,
          host: config.host,
          port: config.port,
          database: config.database,
          username: config.username,
        });

        return config;
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MongooseModule');
        const uri = configService.get('MONGODB_URI');

        if (!uri) {
          logger.error('MONGODB_URI no está definida en las variables de entorno');
          throw new Error('MONGODB_URI no está definida en las variables de entorno');
        }

        logger.debug('MongoDB URI configurada:', uri);
        return { uri };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'TransactionLog', schema: TransactionLogSchema },
      { name: 'SystemLog', schema: SystemLogSchema },
    ]),
  ],
})
export class DatabaseModule {} 