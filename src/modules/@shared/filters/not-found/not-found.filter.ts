import { CustomNotFoundError } from '@core/@shared/erros/not-found.error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { Response } from 'express';

@Catch(CustomNotFoundError)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: CustomNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: exception.message,
    });
  }
}
