import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsValidRewardName,
  IsValidRewardDescription,
  IsValidPointsBalance,
} from '../../common/validators/entity.validators';

@ObjectType()
@Entity('rewards')
export class Reward {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  @IsValidRewardName()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  @IsValidRewardDescription()
  description?: string;

  @Field(() => Int)
  @Column()
  @IsValidPointsBalance()
  pointsCost: number;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  stock?: number;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
