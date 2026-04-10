import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  DomainException,
  EntityNotFoundException,
  UnauthorizedTenantException,
  BusinessRuleViolationException,
} from '../../exceptions/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.resolveStatus(exception);

    this.logger.error(exception.message, exception.stack);

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
    });
  }

  private resolveStatus(exception: DomainException): number {
    if (exception instanceof EntityNotFoundException) return HttpStatus.NOT_FOUND;
    if (exception instanceof UnauthorizedTenantException) return HttpStatus.FORBIDDEN;
    if (exception instanceof BusinessRuleViolationException) return HttpStatus.UNPROCESSABLE_ENTITY;
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
