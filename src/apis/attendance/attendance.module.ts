import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { AttendanceRepository } from './attendance.repository';
import { StudentRepository } from '../students/student.repository';
import { DateUtilService } from 'src/utils/attendance.util';

@Module({
  exports: [AttendanceService],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    AttendanceRepository,
    StudentRepository,
    DateUtilService,
  ],
})
export class AttendanceModule {}
