import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from '../students.service';
import { TransactionManager } from 'src/prisma/prisma-transaction.manager';
import { ParentRepository } from 'src/apis/parent/parent.repository';
import { StudentRepository } from '../student.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentRequestDto } from '../dto/create-student.dto';

describe('StudentsService', () => {
  let service: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentsService],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
