import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { AttendanceRepository } from './attendance.repository';
import { StudentRepository } from '../students/student.repository';

@Module({
  exports: [AttendanceService],
  controllers: [AttendanceController],
  providers: [AttendanceService, StudentRepository, AttendanceRepository],
})
export class AttendanceModule {}
