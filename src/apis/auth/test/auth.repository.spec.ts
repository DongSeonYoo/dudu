import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthRepository } from '../auth.repository';

describe('AuthRepository Test', () => {
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [AuthRepository],
    }).compile();

    authRepository = module.get<AuthRepository>(AuthRepository);
  });
});
