import { NotFoundException } from '@nestjs/common';

export class ParentNotFoundException extends NotFoundException {
  constructor(message: string = '해당하는 부모님 정보가 존재하지 않습니다.') {
    super(message);
  }
}
