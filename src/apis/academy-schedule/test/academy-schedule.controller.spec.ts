import { Test, TestingModule } from '@nestjs/testing';
import { AcademyScheduleController } from '../academy-schedule.controller';
import { AcademyScheduleService } from '../academy-schedule.service';

describe('AcademyScheduleController', () => {
  let controller: AcademyScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademyScheduleController],
      providers: [AcademyScheduleService],
    }).compile();

    controller = module.get<AcademyScheduleController>(
      AcademyScheduleController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
