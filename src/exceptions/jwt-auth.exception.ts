import { UnauthorizedException } from '@nestjs/common';

export class JwtAuthException extends UnauthorizedException {
  constructor(message: string = '로그인 필요한 서비스 입니다') {
    super(message);
  }
}
