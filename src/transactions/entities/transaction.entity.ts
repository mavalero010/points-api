import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

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
  @Column()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.transactions)
  user: User;

  @Field()
  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.EARN,
  })
  type: TransactionType;

  @Field(() => Int)
  @Column()
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