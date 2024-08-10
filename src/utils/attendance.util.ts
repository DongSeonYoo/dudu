import { Injectable } from '@nestjs/common';

@Injectable()
export class DateUtilService {
  getToday(): Date {
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);

    return today;
  }

  getTommorow(): Date {
    const tomorrow = this.getToday();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow;
  }
}
