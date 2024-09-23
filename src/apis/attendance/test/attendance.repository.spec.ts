import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceRepository } from '../attendance.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DateUtilService } from 'src/utils/date-util/date-util.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { attendanceSeed } from 'test/util/seed/attendance-seed';
import { AttendanceEntity } from '../entity/attendance.entity';
import { Attendance, Prisma, Student } from '@prisma/client';
import { StudentEntity } from 'src/apis/students/entity/students.entity';
import { studentSeed } from 'test/util/seed/student-seed';
import { parentSeed } from 'test/util/seed/parent-seed';

describe('AttendanceRepository Test', () => {
  let attendanceRepository: AttendanceRepository;
  let prisma: PrismaService;
  let dateUtilService: DateUtilService;
  let findFirstStudent: Student;
  let findFirstAttendance: Attendance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [AttendanceRepository, DateUtilService],
    }).compile();

    attendanceRepository =
      module.get<AttendanceRepository>(AttendanceRepository);
    prisma = module.get<PrismaService>(PrismaService);
    dateUtilService = module.get<DateUtilService>(DateUtilService);

    await prisma.$transaction(async (tx) => {
      const students = await studentSeed(tx);
      await parentSeed(students, tx);
      await attendanceSeed(students, tx);
    });
  });

  beforeEach(async () => {
    findFirstStudent = await prisma.student.findFirstOrThrow();
    findFirstAttendance = await prisma.attendance.findFirstOrThrow();
  });

  afterEach(async () => {
    await prisma.$transaction([
      prisma.attendance.deleteMany(),
      prisma.parent.deleteMany(),
      prisma.student.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('findTodayAttendance', () => {
    it('해당하는 학생의 오늘의 출석 정보를 가져온다', async () => {
      // given
      const studentIdx = findFirstStudent.idx;
      const spy = jest.spyOn(AttendanceEntity, 'from');

      // when
      const act = await attendanceRepository.findTodayAttendance(studentIdx);

      // then
      expect(act).toBeInstanceOf(AttendanceEntity);
      expect(spy).toHaveBeenCalled();
    });

    it('해당하는 학생의 오늘의 출석 정보가 없을 경우 null을 반환한다', async () => {
      // given
      const studentIdx = 9999;
      const spy = jest.spyOn(AttendanceEntity, 'from');

      // when
      const act = await attendanceRepository.findTodayAttendance(studentIdx);

      // then
      expect(act).toBeNull();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('checkIn', () => {
    it('해당하는 학생의 출석 정보를 생성한다', async () => {
      // given
      const studentIdx = findFirstStudent.idx;

      // when
      await attendanceRepository.checkIn(studentIdx);

      const result = await prisma.attendance.findFirstOrThrow({
        where: {
          studentIdx: studentIdx,
        },
      });

      // then
      expect(result.isOuting).toBeFalsy();
      expect(result.checkOutAt).toBeNull();
      expect(result.checkInAt).toBeDefined();
    });
  });

  describe('checkOut', () => {
    it('해당하는 학생의 출석 정보를 수정한다 (하원)', async () => {
      // given
      const attendanceIdx = findFirstAttendance.idx;

      // when
      await attendanceRepository.checkOut(attendanceIdx);

      const act = await prisma.attendance.findFirstOrThrow({
        where: {
          idx: attendanceIdx,
        },
      });

      // then
      expect(act.checkOutAt).toBeDefined();
    });
    it('만약 출석 정보가 존재하지 않는다면 prismaClientKnownRequestError가 발생한다', async () => {
      // given
      const attendanceIdx = 9999;

      // when
      const act = attendanceRepository.checkOut(attendanceIdx);

      // then
      await expect(act).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
    });
  });

  describe('getAttendanceListOfDate', () => {
    let date = new Date();

    it('해당하는 날짜의 학생들의 출석 정보를 가져온다', async () => {
      // given & when
      const getBeginningOfDateSpy = jest.spyOn(
        dateUtilService,
        'getBeginningOfDate',
      );
      const getBeginningOfDateTommorwSpy = jest.spyOn(
        dateUtilService,
        'getBeginningOfDateTommorw',
      );
      const act = await attendanceRepository.getAttendanceListOfDate(date);

      // then
      expect(act[0].student).toBeInstanceOf(StudentEntity);
      expect(act[0].attendance).toBeInstanceOf(AttendanceEntity);
      expect(getBeginningOfDateSpy).toHaveBeenCalled();
      expect(getBeginningOfDateTommorwSpy).toHaveBeenCalled();
    });

    it('해당하는 날짜의 학생의 출석 정보가 없을 경우, 해당 학생의 attendance는 null을 반환한다', async () => {
      // given
      const deletedAttendanceIdx = findFirstAttendance.idx;
      await prisma.attendance.delete({
        where: {
          idx: deletedAttendanceIdx,
        },
      });

      // when
      const act = await attendanceRepository.getAttendanceListOfDate(date);

      // then
      expect(act[0].student).toBeInstanceOf(StudentEntity);
      expect(act[0].attendance).toBeNull();
    });
  });
});
