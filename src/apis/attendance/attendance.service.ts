import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';
import { StudentRepository } from '../students/student.repository';
import { AttendanceEntity } from './entity/attendance.entity';
import {
  AttendanceListRequestDto,
  AttendanceListResponseDto,
} from './dto/attendance-list.dto';
import { StudentNotFoundException } from '../students/exception/student-not-found.exception';
import { AlreadyCheckOutException } from './exception/already-check-out.exception';
import { AlreadyCheckInException } from './exception/already-check-in.exception';
import { NotCheckInException } from './exception/not-check-in.exception';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository,
    private readonly studentRepository: StudentRepository,
  ) {}

  /**
   * 등원체크
   * 1. 학생이 존재하는지 확인
   * 2. 등원 유효성 체크
   * 3. 등원 처리
   */
  async checkIn(studentIdx: number): Promise<void> {
    // 1. 학생이 존재하는지 확인
    const findStudentResult =
      await this.studentRepository.findStudentByIdx(studentIdx);
    if (!findStudentResult) {
      throw new StudentNotFoundException();
    }

    // 2. 등원 유효성 체크
    await this.attendanceRepository
      .findTodayAttendance(studentIdx)
      .then(this.validateCheckIn);

    // 3. 등원 처리
    await this.attendanceRepository.checkIn(studentIdx);

    return;
  }

  /**
   * 하원체크
   * 1. 학생이 존재하는지 확인
   * 2. 하원 유효성 체크
   * 3. 하원 처리
   */
  async checkOut(studentIdx: number): Promise<void> {
    // 1. 학생이 존재하는지 확인
    const findStudentResult =
      await this.studentRepository.findStudentByIdx(studentIdx);
    if (!findStudentResult) {
      throw new StudentNotFoundException();
    }

    // 2. 하원 유효성 체크
    const attendance = await this.attendanceRepository
      .findTodayAttendance(studentIdx)
      .then(this.validateCheckOut);

    // 3. 하원 처리
    await this.attendanceRepository.checkOut(attendance.idx);
  }

  /**
   * 등원 시 유효성을 검증한다
   *
   * @param attendance 출결 정보
   */
  private validateCheckIn(attendance: AttendanceEntity | null): void {
    if (!attendance) {
      return;
    }

    if (attendance.checkOutAt) {
      throw new AlreadyCheckOutException();
    }

    if (attendance.checkInAt) {
      throw new AlreadyCheckInException();
    }

    return;
  }

  /**
   * 하원 시 유효성을 검증한다
   *
   * @param attendance 출결 정보
   */
  private validateCheckOut(
    attendance: AttendanceEntity | null,
  ): AttendanceEntity {
    if (!attendance) {
      throw new NotCheckInException();
    }

    if (attendance.checkOutAt) {
      throw new AlreadyCheckOutException();
    }

    return attendance;
  }

  async getAttendanceList({
    date,
  }: AttendanceListRequestDto): Promise<AttendanceListResponseDto[]> {
    const result =
      await this.attendanceRepository.getAttendanceListOfDate(date);

    return result.map((res) => {
      return AttendanceListResponseDto.of(res.student, res.attendance);
    });
  }
}
