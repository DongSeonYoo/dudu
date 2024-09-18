import { NotFoundException } from '@nestjs/common';

export class StudentNotFoundException extends NotFoundException {
  constructor(message: string = '학생을 찾을 수 없습니다.') {
    super(message);
  }
}
