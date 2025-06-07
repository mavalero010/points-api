import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Length,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';

@InputType()
export class CreateRewardInput {
  @Field(() => String)
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  name: string;

  @Field(() => Int)
  @IsNumber({}, { message: 'El costo en puntos debe ser un número' })
  @IsNotEmpty({ message: 'El costo en puntos es requerido' })
  @Min(1, { message: 'El costo mínimo en puntos es 1' })
  @Max(1000000, { message: 'El costo máximo en puntos es 1,000,000' })
  pointsCost: number;

  @Field(() => String, { nullable: true })
  @IsString({ message: 'La descripción debe ser texto' })
  @IsOptional()
  @Length(3, 500, { message: 'La descripción debe tener entre 3 y 500 caracteres' })
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  stock?: number;

  @Field(() => Boolean, { defaultValue: true })
  @IsBoolean({ message: 'El estado debe ser booleano' })
  @IsOptional()
  isActive?: boolean;
}
