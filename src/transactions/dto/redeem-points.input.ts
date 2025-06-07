import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class RedeemPointsInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  rewardId: string;

  @Field(() => String, { nullable: true })
  description?: string;
} 