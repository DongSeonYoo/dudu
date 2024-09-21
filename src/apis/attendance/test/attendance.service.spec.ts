import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from '../attendance.service';
import { StudentRepository } from 'src/apis/students/student.repository';
import { mock, MockProxy } from 'jest-mock-extended';
import { AttendanceRepository } from '../attendance.repository';
import { StudentEntity } from 'src/apis/students/entity/students.entity';
import { AttendanceEntity } from '../entity/attendance.entity';
import {
  AttendanceListRequestDto,
  AttendanceListResponseDto,
} from '../dto/attendance-list.dto';
import { StudentNotFoundException } from 'src/apis/students/exception/student-not-found.exception';
import { AlreadyCheckInException } from '../exception/already-check-in.exception';
import { AlreadyCheckOutException } from '../exception/already-check-out.exception';
import { NotCheckInException } from '../exception/not-check-in.exception';

describe('AttendanceService', () => {
  let attendanceService: AttendanceService;
  let studentRepository: MockProxy<StudentRepository>;
  let attendanceRepository: MockProxy<AttendanceRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: StudentRepository,
          useFactory: (): StudentRepository => mock<StudentRepository>(),
        },
        {
          provide: AttendanceRepository,
          useFactory: (): AttendanceRepository => mock<AttendanceRepository>(),
        },
      ],
    }).compile();

    attendanceService = module.get<AttendanceService>(AttendanceService);
    studentRepository = module.get(StudentRepository);
    attendanceRepository = module.get(AttendanceRepository);
  });

  describe('checkIn (등원 체크)', () => {
    const studentIdx = 1;

    it('학생이 존재하지 않으면 StudentNotFoundException 발생한다', async () => {
      // given
      studentRepository.findStudentByIdx.mockResolvedValue(null);

      // when
      const act = async () => await attendanceService.checkIn(studentIdx);

      // then
      await expect(act).rejects.toThrow(StudentNotFoundException);
    });

    describe('등원 시 유효성을 검증한다', () => {
      const studentIdx = 1;

      it('이미 등원 한 학생일 경우, AlreadyCheckInException 발생한다', async () => {
        // given
        studentRepository.findStudentByIdx.mockResolvedValue({
          idx: studentIdx,
        } as StudentEntity);
        attendanceRepository.findTodayAttendance.mockResolvedValue({
          checkInAt: new Date(),
        } as AttendanceEntity);

        // when
        const act = async () => await attendanceService.checkIn(studentIdx);

        // then
        await expect(act).rejects.toThrow(AlreadyCheckInException);
      });

      it('이미 하원 한 학생일 경우, AlreadyCheckOutException 발생한다', async () => {
        // given
        studentRepository.findStudentByIdx.mockResolvedValue({
          idx: studentIdx,
        } as StudentEntity);
        attendanceRepository.findTodayAttendance.mockResolvedValue({
          checkOutAt: new Date(),
        } as AttendanceEntity);

        // when
        const act = async () => await attendanceService.checkIn(studentIdx);

        // then
        await expect(act).rejects.toThrow(new AlreadyCheckOutException());
      });
    });
  });

  describe('checkOut (하원 체크)', () => {
    let studentIdx = 1;
    it('학생이 존재하지 않으면 StudentNotFoundException이 발생한다', async () => {
      // given
      studentRepository.findStudentByIdx.mockResolvedValue(null);

      // when
      const act = async () => await attendanceService.checkIn(studentIdx);

      // then
      await expect(act).rejects.toThrow(StudentNotFoundException);
    });

    describe('하원 시 유효성을 검증한다', () => {
      it('이미 하원 한 학생인 경우, AlreadyCheckOutException 발생한다', async () => {
        // given
        studentRepository.findStudentByIdx.mockResolvedValue({
          idx: studentIdx,
        } as StudentEntity);
        attendanceRepository.findTodayAttendance.mockResolvedValue({
          checkOutAt: new Date(),
        } as AttendanceEntity);

        // when
        const act = async () => await attendanceService.checkOut(studentIdx);

        // then
        await expect(act).rejects.toThrow(AlreadyCheckOutException);
      });

      it('오늘 등원하지 않은 학생인 경우, NotCheckInException 발생한다', async () => {
        // given
        studentRepository.findStudentByIdx.mockResolvedValue({
          idx: studentIdx,
        } as StudentEntity);
        attendanceRepository.findTodayAttendance.mockResolvedValue(null);

        // when
        const act = async () => await attendanceService.checkOut(studentIdx);

        // then
        await expect(act).rejects.toThrow(NotCheckInException);
      });
    });
  });

  describe('getAttendanceList', () => {
    it('해당하는 날짜의 출석 기록을 가져온다', async () => {
      // given
      const givenData = [
        {
          student: {},
          attendance: {},
        },
        {
          student: {},
          attendance: {},
        },
      ] as Array<{
        student: StudentEntity;
        attendance: AttendanceEntity | null;
      }>;

      attendanceRepository.getAttendanceListOfDate.mockResolvedValue(givenData);

      // when
      const spy = jest.spyOn(AttendanceListResponseDto, 'of');
      const act = await attendanceService.getAttendanceList(
        {} as AttendanceListRequestDto,
      );

      // then
      expect(spy).toHaveBeenCalledTimes(givenData.length);
      expect(spy).toHaveBeenCalledWith(
        givenData[0].student,
        givenData[0].attendance,
      );
      expect(act).toBeInstanceOf(Array<AttendanceListResponseDto>);
    });
  });
});
