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

  formatTimeToHHMM(date: Date = new Date()): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
