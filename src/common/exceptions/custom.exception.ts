import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string, statusCode: number = HttpStatus.BAD_REQUEST) {
    super(message, statusCode);
  }
}

export class PointsException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class UserNotFoundException extends CustomException {
  constructor(userId: string) {
    super(`Usuario con ID ${userId} no encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class InsufficientPointsException extends CustomException {
  constructor(available: number, required: number) {
    super(
      `Puntos insuficientes. Disponible: ${available}, Requerido: ${required}`,
      HttpStatus.BAD_REQUEST
    );
  }
} 