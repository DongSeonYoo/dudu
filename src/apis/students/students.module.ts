import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentRepository } from './student.repository';
import { TransactionManager } from 'src/prisma/prisma-transaction.manager';
import { ParentRepository } from '../parent/parent.repository';

@Module({
  controllers: [StudentsController],
  providers: [
    StudentsService,
    StudentRepository,
    TransactionManager,
    ParentRepository,
  ],
})
export class StudentsModule {}
