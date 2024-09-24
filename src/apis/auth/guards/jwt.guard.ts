import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
    if (err || !user) {
      throw err || new JwtAuthException();
    }

    return user;
  }
}
