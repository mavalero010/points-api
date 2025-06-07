import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPositiveNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPositiveNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'El valor debe ser un número positivo',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return typeof value === 'number' && value > 0;
        },
      },
    });
  };
}

export function IsValidPoints(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidPoints',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Los puntos deben ser un número entero positivo',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return (
            typeof value === 'number' &&
            Number.isInteger(value) &&
            value > 0 &&
            value <= 1000000 // Límite máximo de puntos por transacción
          );
        },
      },
    });
  };
} 