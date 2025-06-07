import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { GraphQLError } from 'graphql';
import { CustomException } from '../exceptions/custom.exception';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Si ya es un GraphQLError, lo dejamos pasar
        if (error instanceof GraphQLError) {
          this.logger.warn(`GraphQL Error: ${error.message}`);
          return throwError(() => error);
        }

        // Si es una excepción personalizada
        if (error instanceof CustomException) {
          const graphqlError = new GraphQLError(error.message, {
            extensions: {
              code: error.name || 'CUSTOM_EXCEPTION',
              statusCode: error.getStatus(),
              timestamp: new Date().toISOString(),
              details: error.getResponse(),
            },
          });
          this.logger.warn(`Custom Exception: ${error.message}`);
          return throwError(() => graphqlError);
        }

        // Si es una excepción HTTP
        if (error instanceof HttpException) {
          const graphqlError = new GraphQLError(error.message, {
            extensions: {
              code: error.name || 'HTTP_EXCEPTION',
              statusCode: error.getStatus(),
              timestamp: new Date().toISOString(),
              details: error.getResponse(),
            },
          });
          this.logger.warn(`HTTP Exception: ${error.message}`);
          return throwError(() => graphqlError);
        }

        this.logger.error('Error no manejado:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });

        const graphqlError = new GraphQLError(
          'Ha ocurrido un error interno. Por favor, intente más tarde.',
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              timestamp: new Date().toISOString(),
              details:
                process.env.NODE_ENV === 'production'
                  ? 'Error interno del servidor'
                  : error.message,
            },
          },
        );

        return throwError(() => graphqlError);
      }),
    );
  }
}
