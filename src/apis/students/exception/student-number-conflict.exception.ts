import { ConflictException } from '@nestjs/common';

export class StudentNumberConflictException extends ConflictException {
  constructor(message = '이미 존재하는 학번입니다.') {
    super(message);
  }
}
