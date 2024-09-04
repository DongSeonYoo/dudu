import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OutingRepository } from '../outing.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { DateUtilService } from 'src/utils/date-util/date-util.service';
import { seedStudents, studentSeedList } from 'test/util/seed/student-seed';
import {
  attendanceSeedList,
  seedAttendances,
} from 'test/util/seed/attendance-seed';
import { OutingEntity } from '../entity/outing.entity';

describe('OutingRepository Test', () => {
  let outingRepository: OutingRepository;
  let prismaService: PrismaService;
  let dateUtilService: DateUtilService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [OutingRepository, DateUtilService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    outingRepository = module.get<OutingRepository>(OutingRepository);
    dateUtilService = module.get<DateUtilService>(DateUtilService);

    await seedStudents(studentSeedList);
    await seedAttendances(attendanceSeedList);
  });

  afterAll(async () => {
    await prismaService.$transaction([
      prismaService.outing.deleteMany(),
      prismaService.attendance.deleteMany(),
      prismaService.student.deleteMany(),
    ]);

    await prismaService.$disconnect();
  });

  describe('goOuting', () => {
    it('외출 정보를 생성한다', async () => {
      // given
      const studentIdx = studentSeedList[0].idx;
      const outingEntity = new OutingEntity();
      outingEntity.studentIdx = studentIdx;
      outingEntity.attendanceIdx = attendanceSeedList[0].idx;
      outingEntity.reason = '병원가요';
      outingEntity.startedAt = new Date();
      outingEntity.endedAt = new Date(
        outingEntity.startedAt.getTime() + 60 * 60 * 1000,
      );
      const spy = jest.spyOn(OutingEntity, 'from');

      // when
      const act = await outingRepository.goOuting(outingEntity);

      // then
      expect(spy).toHaveBeenCalled();
      expect(act).toBeInstanceOf(OutingEntity);
      expect(act.attendanceIdx).toBe(outingEntity.attendanceIdx);
      expect(act.reason).toBe(outingEntity.reason);
      expect(act.startedAt).toStrictEqual(outingEntity.startedAt);
      expect(act.endedAt).toStrictEqual(outingEntity.endedAt);
    });
  });
});
