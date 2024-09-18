import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { InvalidDayOfWeekException } from 'src/exceptions/invalid-day-of-week.exception';
import { DateUtilService } from 'src/utils/date-util/date-util.service';

/**
 * 요일을 가공하는 데코레이터
 */
export const CalculateDay = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const dateUtilService = new DateUtilService();

    if (request.query.day) {
      const day = parseInt(request.query.day);
      if (!dateUtilService.isDayOfWeek(day)) {
        throw new InvalidDayOfWeekException();
      }

      return day;
    }

    return dateUtilService.getCurrentDayOfWeek();
  },
);
