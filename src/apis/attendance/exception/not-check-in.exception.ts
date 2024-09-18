import { BadRequestException } from '@nestjs/common';

export class NotCheckInException extends BadRequestException {
  constructor(message = '등원 처리되지 않은 학생입니다.') {
    super(message);
  }
}
