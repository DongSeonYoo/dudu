import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentRepository } from './student.repository';
import { TransactionManager } from 'src/prisma/prisma-transaction.manager';
import { ParentRepository } from '../parent/parent.repository';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { EnrollmentRepository } from '../enrollment/entollment.repository';

@Module({
  imports: [EnrollmentModule],
  exports: [StudentsService],
  controllers: [StudentsController],
  providers: [
    StudentsService,
    StudentRepository,
    TransactionManager,
    ParentRepository,
    EnrollmentRepository,
  ],
})
export class StudentsModule {}
