import { Module } from '@nestjs/common';
import { OutingService } from './outing.service';
import { OutingController } from './outing.controller';
import { AttendanceModule } from '../attendance/attendance.module';
import { TransactionManager } from 'src/prisma/prisma-transaction.manager';
import { StudentsModule } from '../students/students.module';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { StudentRepository } from '../students/student.repository';
import { OutingRepository } from './outing.repository';

@Module({
  imports: [AttendanceModule, StudentsModule],
  controllers: [OutingController],
  providers: [
    OutingService,
    TransactionManager,
    AttendanceRepository,
    StudentRepository,
    OutingRepository,
  ],
})
export class OutingModule {}
