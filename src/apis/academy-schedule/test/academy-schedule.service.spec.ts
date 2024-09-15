import { Test, TestingModule } from '@nestjs/testing';
import { AcademyScheduleService } from '../academy-schedule.service';
import { AcademyScheduleRepository } from '../academy-schedule.repository';
import { MockProxy } from 'jest-mock-extended';
import { PrismaModule } from 'src/prisma/prisma.module';

describe('AcademyScheduleService', () => {
  let academyScheduleService: AcademyScheduleService;
  let academyScheduleRepository: MockProxy<AcademyScheduleRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [AcademyScheduleService, AcademyScheduleRepository],
    }).compile();

    academyScheduleService = module.get<AcademyScheduleService>(
      AcademyScheduleService,
    );
    academyScheduleRepository = module.get(AcademyScheduleRepository);
  });

  it('should be defined', () => {
    expect(academyScheduleService).toBeDefined();
  });
});
