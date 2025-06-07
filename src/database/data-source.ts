import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { User } from '../users/entities/user.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Reward } from '../rewards/entities/reward.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'points_db',
  entities: [User, Transaction, Reward],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false,
});
