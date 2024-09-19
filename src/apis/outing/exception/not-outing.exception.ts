import { NotFoundException } from '@nestjs/common';

export class NotOutingException extends NotFoundException {
  constructor(message: string = '외출 중인 학생이 아닙니다') {
    super(message);
  }
}
