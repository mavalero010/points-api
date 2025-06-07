import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length, IsNotEmpty, Matches } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  name: string;
}
