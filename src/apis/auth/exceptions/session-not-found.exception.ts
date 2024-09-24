import { UnauthorizedException } from '@nestjs/common';

export class SessionNotFoundException extends UnauthorizedException {
  constructor() {
    super('세션이 존재하지 않습니다.');
  }
}
