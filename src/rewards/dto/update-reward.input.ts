import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateRewardInput } from './create-reward.input';

@InputType()
export class UpdateRewardInput extends PartialType(CreateRewardInput) {} 