import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { IsValidUserName, IsValidPointsBalance } from '../../common/validators/entity.validators';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  @IsValidUserName()
  name: string;

  @Field()
  @Column({ default: 0 })
  @IsValidPointsBalance()
  totalPoints: number;

  @Field(() => [Transaction], { nullable: true })
  @OneToMany(() => Transaction, (transaction) => transaction.userId)
  transactions: Transaction[];

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
