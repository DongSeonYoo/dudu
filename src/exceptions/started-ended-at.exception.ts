import { BadRequestException } from '@nestjs/common';

export class StratedAtEndedAtException extends BadRequestException {
  constructor(message: string = 'startedAt은 endedAt보다 이전이어야 합니다.') {
    super(message);
  }
}
