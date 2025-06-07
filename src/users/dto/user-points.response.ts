import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserPointsResponse {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Float)
  totalPoints: number;

  @Field(() => Date)
  updatedAt: Date;
}
