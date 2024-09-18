import { BadRequestException } from '@nestjs/common';

export class AlreadyCheckInException extends BadRequestException {
  constructor(message = '이미 등원 처리된 학생입니다.') {
    super(message);
  }
}
