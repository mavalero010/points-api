import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { CustomException } from '../exceptions/custom.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const gqlContext = GqlExecutionContext.create(host as ExecutionContext);
    const _ctx = gqlContext.getContext();

    if (exception instanceof GraphQLError) {
      this.logger.warn(`GraphQL Error: ${exception.message}`);
      return exception;
    }

    if (exception instanceof CustomException) {
      const graphqlError = new GraphQLError(exception.message, {
        extensions: {
          code: exception.name || 'CUSTOM_EXCEPTION',
          statusCode: exception.getStatus(),
          timestamp: new Date().toISOString(),
          details: exception.getResponse(),
        },
      });
      this.logger.warn(`Custom Exception: ${exception.message}`, exception.getResponse());
      return graphqlError;
    }

    if (exception instanceof HttpException) {
      const graphqlError = new GraphQLError(exception.message, {
        extensions: {
          code: exception.name || 'HTTP_EXCEPTION',
          statusCode: exception.getStatus(),
          timestamp: new Date().toISOString(),
          details: exception.getResponse(),
        },
      });
      return graphqlError;
    }

    this.logger.error('Error no manejado:', {
      message: exception instanceof Error ? exception.message : 'Error desconocido',
      stack: exception instanceof Error ? exception.stack : undefined,
      name: exception instanceof Error ? exception.name : 'UnknownError',
    });

    return new GraphQLError('Ha ocurrido un error interno. Por favor, intente más tarde.', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        details:
          process.env.NODE_ENV === 'production'
            ? 'Error interno del servidor'
            : exception instanceof Error
              ? exception.message
              : 'Error desconocido',
      },
    });
  }
}
