import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IExceptionResponse } from 'src/interfaces/response.interface';

@Catch(Error)
export class UnhandledExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    const response: IExceptionResponse = {
      message: '서버에서 에러가 발생했습니다.',
      requestURL: req.url,
      statusCode: statusCode,
      timestamp: new Date(),
    };

    if (this.configService.get<string>('NODE_ENV') === 'development') {
      this.logger.error(
        exception.message,
        exception.stack,
        'UnhandledExceptionFilter',
      );
    }

    return res.status(statusCode).send(response);
  }
}
