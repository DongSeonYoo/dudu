import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { DayOfWeek } from '../enum/day-of-week.enum';

@Injectable()
export class DateUtilService {
  /**
   * 특정 날짜의 시작을 가져옵니다.
   * @param date 시작을 가져오고 싶은 날짜
   * @default date 오늘 날짜
   *
   * @return ISO datestring for prisma
   *
   */
  getBeginningOfDate(date: Date = new Date()): Date {
    const dateString = dayjs(date).format('YYYY-MM-DD').concat('T00:00:00Z');

    return this.stringToUtcDate(dateString);
  }

  /**
   * 특정 날짜의 다음 날의 시작을 가져옵니다.
   * @param date 시작을 가져오고 싶은 날짜
   * @default date 오늘 날짜
   *
   * @returns ISO datestring for prisma
   */
  getBeginningOfDateTommorw(date: Date = new Date()): Date {
    const dateSTring = dayjs(date)
      .add(1, 'day')
      .format('YYYY-MM-DD')
      .concat('T00:00:00Z');

    return this.stringToUtcDate(dateSTring);
  }

  /**
   * ISO datestring을 Date로 변환합니다.
   *
   * @param dateString ISO datestring
   * @returns Date
   */
  stringToUtcDate(dateString: string): Date {
    return dayjs(dateString).toDate();
  }

  /**
   * 받은 날짜에 특정 기간 (일)을 더합니다.
   */
  addDays(date: Date, days: number): Date {
    return dayjs(date).add(days, 'day').toDate();
  }

  /**
   * 주어진 JS 요일을 DayOfWeek 열거형으로 매핑.
   *
   * @param jsDay JS 요일 (0부터 6까지)
   * @returns DayOfWeek 열거형
   */
  private mapJSDateToDayOfWeek(jsDay: number): DayOfWeek {
    const dayMap = [1, 2, 4, 8, 16, 32, 64];

    return dayMap[jsDay];
  }

  /**
   * 현재 요일을 DayOfWeek 열거형으로 가져옵니다.
   *
   * @returns 현재 요일의 DayOfWeek 열거형
   */
  getCurrentDayOfWeek(): DayOfWeek {
    const today = new Date().getDay();

    return this.mapJSDateToDayOfWeek(today);
  }

  /**
   * 주어진 값이 DayOfWeek인지 확인합니다.
   *
   * @param value 확인할 값
   * @returns DayOfWeek인 경우 true, 그렇지 않은 경우 false
   */
  isDayOfWeek(value: number): boolean {
    return Object.values(DayOfWeek).includes(value);
  }
}
