import { Test, TestingModule } from '@nestjs/testing';
import { AcademyScheduleService } from '../academy-schedule.service';

describe('AcademyScheduleService', () => {
  let service: AcademyScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcademyScheduleService],
    }).compile();

    service = module.get<AcademyScheduleService>(AcademyScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
