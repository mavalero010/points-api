import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString, IsOptional, Length, IsNotEmpty } from 'class-validator';

@InputType()
export class RedeemPointsInput {
  @Field(() => String)
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  userId: string;

  @Field(() => String)
  @IsUUID('4', { message: 'El ID de la recompensa debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de la recompensa es requerido' })
  rewardId: string;

  @Field(() => String, { nullable: true })
  @IsString({ message: 'La descripción debe ser texto' })
  @IsOptional()
  @Length(3, 500, { message: 'La descripción debe tener entre 3 y 500 caracteres' })
  description?: string;
}
