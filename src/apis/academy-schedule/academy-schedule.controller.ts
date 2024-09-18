import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { AcademyScheduleService } from './academy-schedule.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CalculateDay } from '../../decorators/today.decorator';
import { DayOfWeek } from 'src/utils/enum/day-of-week.enum';
import { ApiExceptions } from 'src/decorators/api-exception.decorator';
import { StudentNotFoundException } from '../students/exception/student-not-found.exception';

@ApiTags('AcademySchedule')
@Controller('academy-schedule')
export class AcademyScheduleController {
  constructor(
    private readonly academyScheduleService: AcademyScheduleService,
  ) {}

  /**
   * 학원 스케쥴 조회
   */
  @Get('/:shceduleIdx')
  async getScheduleByIdx() {}

  /**
   * 해당하는 학생의 학원 스케쥴 리스트 조회 (요일별)
   */
  @Get('/:studentIdx/list')
  async getScheduleList() {}

  /**
   * 해당하는 요일의 학원 스케쥴 조회
   *
   * default: 오늘
   */
  @Get('/')
  @ApiQuery({ name: 'day', required: false })
  async getScheduleByDay(@CalculateDay() day: DayOfWeek) {
    return this.academyScheduleService.getScheduleByDay(day);
  }

  /**
   * 학원 스케쥴 등록
   */
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiExceptions(StudentNotFoundException)
  async registerSchedule() {}

  /**
   * 학원 스케쥴 수정
   */
  @Put()
  @HttpCode(HttpStatus.OK)
  async updateSchedule() {}

  /**
   * 학원 스케쥴 삭제
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteSchedule() {}
}
