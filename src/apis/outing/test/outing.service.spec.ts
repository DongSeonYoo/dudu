import { Test, TestingModule } from '@nestjs/testing';
import { OutingService } from '../outing.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { TransactionManager } from 'src/prisma/prisma-transaction.manager';
import { AttendanceRepository } from 'src/apis/attendance/attendance.repository';
import { StudentRepository } from 'src/apis/students/student.repository';
import { OutingRepository } from '../outing.repository';
import { GoOutingRequestDto } from '../dto/go-outing.dto';
import { BadRequestException } from '@nestjs/common';
import { StudentEntity } from 'src/apis/students/entity/students.entity';
import { AttendanceEntity } from 'src/apis/attendance/entity/attendance.entity';
import { Prisma } from '@prisma/client';
import { OutingEntity } from '../entity/outing.entity';

describe('OutingService', () => {
  let outingService: OutingService;
  let transactionManager: MockProxy<TransactionManager>;
  let attendanceRepository: MockProxy<AttendanceRepository>;
  let studentRepository: MockProxy<StudentRepository>;
  let outingRepository: MockProxy<OutingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutingService,
        {
          provide: TransactionManager,
          useFactory: (): TransactionManager => mock<TransactionManager>(),
        },
        {
          provide: AttendanceRepository,
          useFactory: (): AttendanceRepository => mock<AttendanceRepository>(),
        },
        {
          provide: StudentRepository,
          useFactory: (): StudentRepository => mock<StudentRepository>(),
        },
        {
          provide: OutingRepository,
          useFactory: (): OutingRepository => mock<OutingRepository>(),
        },
      ],
    }).compile();

    outingService = module.get<OutingService>(OutingService);
    transactionManager = module.get(TransactionManager);
    attendanceRepository = module.get(AttendanceRepository);
    studentRepository = module.get(StudentRepository);
    outingRepository = module.get(OutingRepository);
  });

  describe('goOuting', () => {
    let dto = new GoOutingRequestDto();
    let mockTransaction = {} as Prisma.TransactionClient;

    it('유효한 학생이 아닌 경우, BadRequestException이 발생한다', async () => {
      // given
      studentRepository.findStudentByIdx.mockResolvedValue(null);
      dto.studentIdx = 999;

      // when
      const act = async () => await outingService.goOuting(dto);

      // then
      await expect(act).rejects.toThrow(
        new BadRequestException('학생이 존재하지 않습니다'),
      );
    });

    it('등원하지 않은 학생인 경우, BadRequestException이 발생한다', async () => {
      // given
      studentRepository.findStudentByIdx.mockResolvedValue({} as StudentEntity);
      attendanceRepository.findTodayAttendance.mockResolvedValue(null);

      // when
      const act = async () => await outingService.goOuting(dto);

      // then
      await expect(act).rejects.toThrow(
        new BadRequestException('등원하지 않은 학생입니다'),
      );
    });

    it('이미 외출중인 학생인 경우, BadRequestException이 발생한다', async () => {
      // given
      studentRepository.findStudentByIdx.mockResolvedValue({} as StudentEntity);
      attendanceRepository.findTodayAttendance.mockResolvedValue({
        isOuting: true,
      } as AttendanceEntity);

      // when
      const act = async () => await outingService.goOuting(dto);

      // then
      await expect(act).rejects.toThrow(
        new BadRequestException('이미 외출 중인 학생입니다'),
      );
    });

    it('금일 출석 내역이 존재한다면, 해당 출석 인덱스로 외출 엔티티를 생성한다', async () => {
      // given
      const findAttendanceIdx = 1;
      studentRepository.findStudentByIdx.mockResolvedValue({} as StudentEntity);
      attendanceRepository.findTodayAttendance.mockResolvedValue({
        idx: findAttendanceIdx,
      } as AttendanceEntity);
      const spy = jest.spyOn(dto, 'toEntity');

      // when
      await outingService.goOuting(dto);

      // then
      expect(spy).toHaveBeenCalledWith(findAttendanceIdx);
    });

    it('트랜잭션 내에서 외출 기록을 생성하고, 외출 정보를 변경한다', async () => {
      // given
      const findAttendanceIdx = 1;
      studentRepository.findStudentByIdx.mockResolvedValue({} as StudentEntity);
      attendanceRepository.findTodayAttendance.mockResolvedValue({
        idx: findAttendanceIdx,
      } as AttendanceEntity);
      transactionManager.runTransaction.mockImplementation(async (cb) =>
        cb(mockTransaction),
      );

      // when
      await outingService.goOuting(dto);

      // then
      expect(transactionManager.runTransaction).toHaveBeenCalled();
      expect(outingRepository.goOuting).toHaveBeenCalledWith(
        expect.any(OutingEntity),
        mockTransaction,
      );
      expect(attendanceRepository.changeOutingState).toHaveBeenCalledWith(
        findAttendanceIdx,
        mockTransaction,
      );
    });
  });
});
