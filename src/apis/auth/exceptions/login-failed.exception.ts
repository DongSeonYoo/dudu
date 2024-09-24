import { BadRequestException } from '@nestjs/common';

export class LoginFailedException extends BadRequestException {
  constructor(message: string = '로그인에 실패하였습니다.') {
    super(message);
  }
}
