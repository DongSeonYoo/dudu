import { UnauthorizedException } from '@nestjs/common';

export class SessionNotMatchedException extends UnauthorizedException {
  constructor(message: string = '세션이 일치하지 않습니다.') {
    super(message);
  }
}
