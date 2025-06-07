import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPositiveNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
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
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPoints',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'El valor de los puntos debe ser un número entero positivo',
        ...validationOptions,
      },
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'number') return false;
          if (!Number.isInteger(value)) return false;
          if (value < 1) return false;
          if (value > 1000000) return false;
          return true;
        },
      },
    });
  };
}
