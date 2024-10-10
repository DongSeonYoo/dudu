import {
  Body,
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
import { StudentNotFoundException } from '../students/exception/student-not-found.exception';
import {
  ScheduleCreateRequestDto,
  ScheduleCreateResponseDto,
} from './dto/create-schedule.dto';
import { ApiSuccess } from 'src/decorators/api-success.decorator';
import { ApiExceptionsTest } from 'src/decorators/api-exception.decorator';

@ApiTags('AcademySchedule')
@Controller('/api/academy-schedule')
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
  @HttpCode(HttpStatus.OK)
  @ApiSuccess(ScheduleCreateResponseDto)
  @ApiExceptionsTest(HttpStatus.NOT_FOUND, [
    {
      exampleTitle: '학생이 존재하지 않을 경우',
      schema: StudentNotFoundException,
    },
  ])
  async registerSchedule(@Body() input: ScheduleCreateRequestDto) {
    return await this.academyScheduleService.createSchedule(input);
  }

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
