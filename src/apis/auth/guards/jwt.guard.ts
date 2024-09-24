import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtAuthException } from 'src/exceptions/jwt-auth.exception';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt') {
  private readonly logger: Logger = new Logger(JwtAccessGuard.name);
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    const res: Response = context.switchToHttp().getResponse();

    if (err || !user) {
      this.logger.error('JwtAccessGuard excute, clear cookie');
      res.clearCookie('accessToken');
      throw err || new JwtAuthException();
    }

    return user;
  }
}
