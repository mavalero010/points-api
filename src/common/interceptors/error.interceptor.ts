import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { GraphQLError } from 'graphql';
import { CustomException } from '../exceptions/custom.exception';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        // Si ya es un GraphQLError, lo dejamos pasar
        if (error instanceof GraphQLError) {
          return throwError(() => error);
        }

        // Si es una excepción HTTP de NestJS
        if (error instanceof HttpException) {
          const graphqlError = new GraphQLError(error.message, {
            extensions: {
              code: error.name || 'HTTP_EXCEPTION',
              statusCode: error.getStatus(),
              timestamp: new Date().toISOString(),
            },
          });
          return throwError(() => graphqlError);
        }

        // Para errores de base de datos u otros errores no manejados
        console.error('Error no manejado:', error);
        const graphqlError = new GraphQLError(
          error.message || 'Error interno del servidor',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              timestamp: new Date().toISOString(),
              originalError: error.message,
            },
          },
        );
        return throwError(() => graphqlError);
      }),
    );
  }
} 