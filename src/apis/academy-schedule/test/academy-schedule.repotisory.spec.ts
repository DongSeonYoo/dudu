import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DateUtilService } from 'src/utils/date-util/date-util.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AcademyScheduleRepository } from '../academy-schedule.repository';

describe('AttendanceRepository Test', () => {
  let academyScheduleRepository: AcademyScheduleRepository;
  let prisma: PrismaService;
  let dateUtilService: DateUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [AcademyScheduleRepository, DateUtilService],
    }).compile();

    academyScheduleRepository = module.get<AcademyScheduleRepository>(
      AcademyScheduleRepository,
    );
    prisma = module.get<PrismaService>(PrismaService);
    dateUtilService = module.get<DateUtilService>(DateUtilService);

    // prepare seed
  });

  afterEach(async () => {
    // 후처리
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
