import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OutingRepository } from '../outing.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { DateUtilService } from 'src/utils/date-util/date-util.service';
import { OutingEntity } from '../entity/outing.entity';
import { studentSeed } from 'test/util/seed/student-seed';
import { attendanceSeed } from 'test/util/seed/attendance-seed';
import { Attendance, Student } from '@prisma/client';

describe('OutingRepository Test', () => {
  let outingRepository: OutingRepository;
  let prismaService: PrismaService;
  let dateUtilService: DateUtilService;
  let findFirstStudent: Student;
  let findFirstAttendance: Attendance;
  let outingEntity: OutingEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [OutingRepository, DateUtilService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    outingRepository = module.get<OutingRepository>(OutingRepository);
    dateUtilService = module.get<DateUtilService>(DateUtilService);

    await prismaService.$transaction(async (tx) => {
      const students = await studentSeed(tx);
      await attendanceSeed(students, tx);
    });
  });

  beforeEach(async () => {
    findFirstStudent = await prismaService.student.findFirstOrThrow();
    findFirstAttendance = await prismaService.attendance.findFirstOrThrow();
    outingEntity = OutingEntity.create({
      attendanceIdx: findFirstAttendance.idx,
      studentIdx: findFirstStudent.idx,
      reason: '병원가요',
      startedAt: new Date(),
      endedAt: new Date(),
    });
  });

  afterEach(async () => {
    await prismaService.$transaction([
      prismaService.outing.deleteMany(),
      prismaService.attendance.deleteMany(),
      prismaService.student.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('goOuting', () => {
    it('외출 정보를 생성한다', async () => {
      // given
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

  describe('findOutingByIdx', () => {
    it('외출 정보를 조회한다', async () => {
      // given
      await outingRepository.goOuting(outingEntity);

      // when
      const spy = jest.spyOn(OutingEntity, 'from');
      const act = await outingRepository.findOutingByIdx(
        outingEntity.studentIdx,
        outingEntity.attendanceIdx,
      );

      // then
      expect(act).toBeInstanceOf(OutingEntity);
      expect(spy).toHaveBeenCalledWith(act);
    });

    it('외출 정보가 없으면 null을 반환한다', async () => {
      // given
      await outingRepository.goOuting(outingEntity);
      outingEntity.attendanceIdx = 9999;

      // when
      const spy = jest.spyOn(OutingEntity, 'from');
      const act = await outingRepository.findOutingByIdx(
        outingEntity.studentIdx,
        outingEntity.attendanceIdx,
      );

      // then
      expect(act).toBeNull();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('returnOuting', () => {
    it('외출 정보를 삭제한다', async () => {
      // given
      await outingRepository.goOuting(outingEntity);

      // when
      await outingRepository.returnOuting(outingEntity);

      const result = await prismaService.outing.findUnique({
        where: {
          attendanceIdx_studentIdx: {
            attendanceIdx: outingEntity.attendanceIdx,
            studentIdx: outingEntity.studentIdx,
          },
        },
      });

      // then
      expect(result).toBeNull();
    });
  });
});
