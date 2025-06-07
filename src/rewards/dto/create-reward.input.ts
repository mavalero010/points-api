import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { IsValidPoints } from '../../common/decorators/validation.decorator';

@InputType()
export class CreateRewardInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => Int)
  @IsValidPoints()
  pointsCost: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  stock?: number;

  @Field({ defaultValue: true })
  @IsOptional()
  isActive?: boolean;
} 