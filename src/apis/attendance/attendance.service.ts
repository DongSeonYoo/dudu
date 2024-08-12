import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';
import { StudentRepository } from '../students/student.repository';
import { AttendanceEntity } from './entity/attendance.entity';

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
      throw new NotFoundException('존재하지 않는 학생입니다.');
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
      throw new NotFoundException('존재하지 않는 학생입니다');
    }

    // 2. 하원 유효성 체크
    const attendace = await this.attendanceRepository
      .findTodayAttendance(studentIdx)
      .then(this.validateCheckOut);

    // 3. 하원 처리
    await this.attendanceRepository.checkOut(attendace.idx);
  }

  /**
   * 등원 시 유효성을 검증한다
   *
   * @param attendance 출결 정보
   */
  async validateCheckIn(attendance: AttendanceEntity | null): Promise<void> {
    if (!attendance) {
      return;
    }

    if (attendance.checkOutAt) {
      throw new BadRequestException('이미 하원한 학생입니다');
    }

    if (attendance.checkInAt) {
      throw new BadRequestException('이미 등원한 학생입니다');
    }

    return;
  }

  /**
   * 하원 시 유효성을 검증한다
   *
   * @param attendance 출결 정보
   */
  async validateCheckOut(
    attendance: AttendanceEntity | null,
  ): Promise<AttendanceEntity> {
    if (!attendance) {
      throw new BadRequestException('등원하지 않은 학생입니다');
    }

    if (attendance.checkOutAt) {
      throw new BadRequestException('이미 하원한 학생입니다');
    }

    return attendance;
  }
}
