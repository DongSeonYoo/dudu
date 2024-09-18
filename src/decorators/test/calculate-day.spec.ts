import { ExecutionContext } from '@nestjs/common';
import { DateUtilService } from 'src/utils/date-util/date-util.service';

describe('CalculateDay Decorator', () => {
  let mockExecutionContext: ExecutionContext;
  let dateUtilService = new DateUtilService();

  beforeEach(() => {
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn(),
    } as unknown as ExecutionContext;
  });

  it.todo('day가 정의되지 않으면 현재 요일의 DayOfWeek값으로 가져옵니다');

  it.todo('day가 DayOfWeek이 아닌 경우 InvalidDayOfWeekException을 던진다');
});
