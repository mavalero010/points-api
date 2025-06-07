import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidUserName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidUserName',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'El nombre debe contener solo letras, espacios y caracteres acentuados',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$/.test(value);
        },
      },
    });
  };
}

export function IsValidPointsBalance(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPointsBalance',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'El balance de puntos debe ser un número no negativo',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          if (typeof value !== 'number') return false;
          return value >= 0 && Number.isFinite(value);
        },
      },
    });
  };
}

export function IsValidRewardName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidRewardName',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message:
          'El nombre de la recompensa debe tener entre 3 y 100 caracteres y puede incluir letras, números y espacios',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]{3,100}$/.test(value);
        },
      },
    });
  };
}

export function IsValidRewardDescription(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidRewardDescription',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'La descripción debe tener entre 3 y 500 caracteres',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          if (value === undefined || value === null) return true;
          if (typeof value !== 'string') return false;
          return value.length >= 3 && value.length <= 500;
        },
      },
    });
  };
}

export function IsValidTransactionType(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidTransactionType',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'El tipo de transacción debe ser "earn" o "redeem"',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return value === 'earn' || value === 'redeem';
        },
      },
    });
  };
}

export function IsValidTransactionPoints(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidTransactionPoints',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Los puntos de la transacción deben ser un número entero válido',
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'number') return false;
          if (!Number.isInteger(value)) return false;

          const obj = args.object as any;
          if (obj.type === 'redeem' && value > 0) return false;
          if (obj.type === 'earn' && value < 0) return false;

          return true;
        },
      },
    });
  };
}
