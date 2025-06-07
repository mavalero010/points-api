import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

@InputType()
export class RegisterPurchaseInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
} 