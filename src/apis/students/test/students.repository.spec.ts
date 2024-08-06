import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StudentRepository } from '../student.repository';

describe('AuthRepository Test', () => {
  let authRepository: StudentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [StudentRepository],
    }).compile();

    authRepository = module.get<StudentRepository>(StudentRepository);
  });
});
