import { Injectable } from '@nestjs/common';
import { DayOfWeek } from 'src/utils/enum/day-of-week.enum';
import { AcademyScheduleRepository } from './academy-schedule.repository';

@Injectable()
export class AcademyScheduleService {
  constructor(
    private readonly academyScheduleRepository: AcademyScheduleRepository,
  ) {}
  async getScheduleByIdx() {}

  async getScheduleList() {}

  async getScheduleByDay(day: DayOfWeek) {}
}
