import { Attendance } from '@prisma/client';

export class AttendanceEntity {
  /**
   * 출석 idx
   *
   * @example 1
   */
  idx: number;

  /**
   * 학생 idx
   *
   * @example 1
   */
  studentIdx: number;

  /**
   * 등원 시간
   *
   * @example '10:00'
   */
  checkInAt: Date;

  /**
   * 등원 시간
   *
   * @example '10:00'
   */
  checkOutAt: Date | null;

  /**
   * 외출 여부
   *
   * @default false
   */
  isOuting: boolean = false;

  /**
   * 생성 일
   *
   * @example '2021-07-01T00:00:00'
   */
  createdAt: Date;

  /**
   * 수정 일
   *
   * @example '2021-07-01T00:00:00
   */
  updatedAt: Date;

  static create(
    args: Pick<AttendanceEntity, 'studentIdx' | 'checkInAt'>,
  ): AttendanceEntity {
    const attendance = new AttendanceEntity();
    attendance.studentIdx = args.studentIdx;
    attendance.checkInAt = args.checkInAt;

    return attendance;
  }

  static from(args: Attendance): AttendanceEntity {
    const attendace = new AttendanceEntity();
    attendace.idx = args.idx;
    attendace.studentIdx = args.studentIdx;
    attendace.checkInAt = args.checkInAt;
    attendace.checkOutAt = args.checkOutAt;
    attendace.isOuting = args.isOuting;
    attendace.createdAt = args.createdAt;
    attendace.updatedAt = args.updatedAt;

    return attendace;
  }
}
