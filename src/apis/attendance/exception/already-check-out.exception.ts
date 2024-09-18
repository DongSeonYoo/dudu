import { BadRequestException } from '@nestjs/common';

export class AlreadyCheckOutException extends BadRequestException {
  constructor(message = '이미 하원 처리된 학생입니다.') {
    super(message);
  }
}
