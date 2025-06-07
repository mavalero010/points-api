import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsString, IsNumber, IsBoolean, IsOptional, Length, Min, Max } from 'class-validator';
import { CreateRewardInput } from './create-reward.input';

@InputType()
export class UpdateRewardInput extends PartialType(CreateRewardInput) {
  @Field(() => String, { nullable: true })
  @IsString({ message: 'El nombre debe ser texto' })
  @IsOptional()
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  name?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber({}, { message: 'El costo en puntos debe ser un número' })
  @IsOptional()
  @Min(1, { message: 'El costo mínimo en puntos es 1' })
  @Max(1000000, { message: 'El costo máximo en puntos es 1,000,000' })
  pointsCost?: number;

  @Field(() => String, { nullable: true })
  @IsString({ message: 'La descripción debe ser texto' })
  @IsOptional()
  @Length(3, 500, { message: 'La descripción debe tener entre 3 y 500 caracteres' })
  description?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean({ message: 'El estado debe ser booleano' })
  @IsOptional()
  isActive?: boolean;
}
