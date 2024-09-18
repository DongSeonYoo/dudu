import { BadRequestException } from '@nestjs/common';

export class NumberStringException extends BadRequestException {
  constructor(message = '정수만 입력 가능합니다') {
    super(message);
  }
}
