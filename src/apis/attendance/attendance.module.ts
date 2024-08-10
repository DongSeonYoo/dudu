import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { AttendanceRepository } from './attendance.repository';
import { TransactionManager } from 'src/prisma/prisma-transaction.manager';
import { StudentRepository } from '../students/student.repository';
import { DateUtilService } from 'src/utils/attendance.util';

@Module({
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    AttendanceRepository,
    StudentRepository,
    TransactionManager,
    DateUtilService,
  ],
})
export class AttendanceModule {}
