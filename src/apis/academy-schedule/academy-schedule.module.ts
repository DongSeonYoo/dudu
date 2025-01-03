import { Module } from '@nestjs/common';
import { AcademyScheduleService } from './academy-schedule.service';
import { AcademyScheduleController } from './academy-schedule.controller';
import { AcademyScheduleRepository } from './academy-schedule.repository';
import { StudentRepository } from '../students/student.repository';

@Module({
  controllers: [AcademyScheduleController],
  providers: [
    AcademyScheduleService,
    AcademyScheduleRepository,
    StudentRepository,
  ],
})
export class AcademyScheduleModule {}
