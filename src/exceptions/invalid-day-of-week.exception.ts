import { BadRequestException } from '@nestjs/common';

export class InvalidDayOfWeekException extends BadRequestException {
  constructor(message = 'Invalid day of week') {
    super(message);
  }
}
