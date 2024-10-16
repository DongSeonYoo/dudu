import { Injectable } from '@nestjs/common';
import { TransactionManager } from 'src/prisma/prisma-transaction.manager';
import { OutingRepository } from './outing.repository';
import { GoOutingRequestDto } from './dto/go-outing.dto';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { StudentRepository } from '../students/student.repository';
import { AlreadyOutingException } from './exception/already-outing.exception';
import { NotCheckInException } from '../attendance/exception/not-check-in.exception';
import { StudentNotFoundException } from '../students/exception/student-not-found.exception';
import { NotOutingException } from './exception/not-outing.exception';
import { ReturnOutingRequestDto } from './dto/return-outing.dto';

@Injectable()
export class OutingService {
  constructor(
    private readonly transactionManager: TransactionManager,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly studentRepository: StudentRepository,
    private readonly outingRepository: OutingRepository,
  ) {}

  /**
   * 1. 유효한 학생인지 검사.
   * 2. 등원 기록이 있는 학생인지
   *   2-1. attendance.is_outing이 false인지 검사.
   * <- 트랜잭션 시작 ->
   * outing.create로 외출 레코드 생성
   * attendance.is_outing true로 변경
   *
   * <- 트랜잭션 종료 ->
   */
  async goOuting(dto: GoOutingRequestDto) {
    // 1.
    const findStudentResult = await this.studentRepository.findStudentByIdx(
      dto.studentIdx,
    );
    if (!findStudentResult) {
      throw new StudentNotFoundException('학생이 존재하지 않습니다');
    }

    // 2.
    const findAttendance = await this.attendanceRepository.findTodayAttendance(
      dto.studentIdx,
    );
    if (!findAttendance) {
      throw new NotCheckInException('등원하지 않은 학생입니다');
    }

    if (findAttendance.isOuting) {
      throw new AlreadyOutingException('이미 외출 중인 학생입니다');
    }
    const outingEntity = dto.toEntity(findAttendance.idx);

    await this.transactionManager.runTransaction(async (tx) => {
      await this.outingRepository.goOuting(outingEntity, tx);

      await this.attendanceRepository.changeOutingState(findAttendance.idx, tx);
    });

    return;
  }

  async returnFromOuting(dto: ReturnOutingRequestDto) {
    const outingEntity = await this.outingRepository.findOutingByIdx(
      dto.studentIdx,
      dto.attendanceIdx,
    );
    if (!outingEntity) {
      throw new NotOutingException();
    }

    await this.transactionManager.runTransaction(async (tx) => {
      await this.outingRepository.returnOuting(outingEntity, tx);

      await this.attendanceRepository.changeOutingState(dto.attendanceIdx, tx);
    });

    return;
  }
}
