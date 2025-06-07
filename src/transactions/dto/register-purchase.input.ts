import { Field, InputType, Float } from '@nestjs/graphql';
import { IsUUID, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

@InputType()
export class RegisterPurchaseInput {
  @Field(() => String)
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  userId: string;

  @Field(() => Float)
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(0.01, { message: 'El monto mínimo debe ser 0.01' })
  @Max(1000000, { message: 'El monto máximo permitido es 1,000,000' })
  @IsNotEmpty({ message: 'El monto es requerido' })
  amount: number;
}
