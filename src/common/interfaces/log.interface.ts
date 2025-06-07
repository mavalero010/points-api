import { Field, ID, ObjectType, Float } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class BaseLog {
  @Field()
  timestamp: Date;

  @Field()
  level: string;

  @Field()
  message: string;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, any>;
}

@ObjectType()
export class TransactionLog extends BaseLog {
  @Field(() => ID)
  userId: string;

  @Field()
  transactionType: string;

  @Field(() => Float)
  points: number;

  @Field()
  status: string;

  @Field({ nullable: true })
  errorDetails?: string;
}

@ObjectType()
export class SystemLog extends BaseLog {
  @Field()
  component: string;

  @Field()
  action: string;

  @Field()
  success: boolean;
}
