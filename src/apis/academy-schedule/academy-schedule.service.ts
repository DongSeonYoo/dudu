import { Injectable } from '@nestjs/common';
import { DayOfWeek } from 'src/utils/enum/day-of-week.enum';
import { AcademyScheduleRepository } from './academy-schedule.repository';
import { StudentRepository } from '../students/student.repository';
import {
  ScheduleCreateRequestDto,
  ScheduleCreateResponseDto,
} from './dto/create-schedule.dto';
import { StudentNotFoundException } from '../students/exception/student-not-found.exception';
import { CreateStudentResponseDto } from '../students/dto/create-student.dto';

@Injectable()
export class AcademyScheduleService {
  constructor(
    private readonly academyScheduleRepository: AcademyScheduleRepository,
    private readonly studentRepository: StudentRepository,
  ) {}

  async getScheduleByIdx() {}

  async createSchedule(dto: ScheduleCreateRequestDto) {
    // 존재하는 학생인지 확인
    const findStudent = await this.studentRepository.findStudentByIdx(
      dto.studentIdx,
    );
    if (!findStudent) {
      throw new StudentNotFoundException();
    }

    // 스케쥴 생성
    const schedule = dto.toEntity();

    // 스케쥴 등록
    const createSchedule =
      await this.academyScheduleRepository.createSchedule(schedule);

    return ScheduleCreateResponseDto.from(createSchedule);
  }

  async getScheduleList() {}

  async getScheduleByDay(day: DayOfWeek) {}
}
