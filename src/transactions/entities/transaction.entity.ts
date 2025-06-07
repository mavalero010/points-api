import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import {
  IsValidTransactionType,
  IsValidTransactionPoints,
} from '../../common/validators/entity.validators';

export enum TransactionType {
  EARN = 'earn',
  REDEEM = 'redeem',
}

@ObjectType()
@Entity('transactions')
export class Transaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field()
  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.EARN,
  })
  @IsValidTransactionType()
  type: TransactionType;

  @Field(() => Int)
  @Column()
  @IsValidTransactionPoints()
  points: number;

  @Field()
  @Column({ type: 'timestamp', name: 'date' })
  date: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  reference?: string;
}
