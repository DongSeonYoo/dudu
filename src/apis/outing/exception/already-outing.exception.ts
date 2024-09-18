import { BadRequestException } from '@nestjs/common';

export class AlreadyOutingException extends BadRequestException {
  constructor(message: string = '이미 외출 중인 학생입니다') {
    super(message);
  }
}
