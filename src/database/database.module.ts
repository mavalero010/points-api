import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Reward } from '../rewards/entities/reward.entity';
import { TransactionLogSchema, SystemLogSchema } from '../common/schemas/log.schema';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('TypeOrmModule');

        const config = {
          type: 'postgres' as const,
          host: (await configService.get('DB_HOST')) || 'localhost',
          port: parseInt((await configService.get('DB_PORT')) || '5432', 10),
          username: (await configService.get('DB_USERNAME')) || 'postgres',
          password: await configService.get('DB_PASSWORD'),
          database: (await configService.get('DB_NAME')) || 'points_db',
          entities: [User, Transaction, Reward],
          autoLoadEntities: true,
          synchronize: (await configService.get('NODE_ENV')) !== 'production',
          logging: (await configService.get('NODE_ENV')) !== 'production',
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
        const uri = await configService.get('MONGODB_URI');

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
