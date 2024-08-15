import { Attendance } from '@prisma/client';
import { StudentEntity } from 'src/apis/students/entity/students.entity';

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
   * 하원 시간
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

  static create(args: IAttendance.ICreateAttendanceRequest): AttendanceEntity {
    const attendance = new AttendanceEntity();
    attendance.studentIdx = args.studentIdx;
    attendance.checkInAt = args.checkInAt;

    return attendance;
  }

  static from(args: Attendance): AttendanceEntity {
    const attendance = new AttendanceEntity();
    attendance.idx = args.idx;
    attendance.studentIdx = args.studentIdx;
    attendance.checkInAt = args.checkInAt;
    attendance.checkOutAt = args.checkOutAt;
    attendance.isOuting = args.isOuting;
    attendance.createdAt = args.createdAt;
    attendance.updatedAt = args.updatedAt;

    return attendance;
  }
}

export namespace IAttendance {
  export interface ICreateAttendanceRequest
    extends Pick<AttendanceEntity, 'studentIdx' | 'checkInAt'> {}

  export interface IAttendanceListResponse
    extends Pick<
        StudentEntity,
        'idx' | 'name' | 'school' | 'type' | 'gender' | 'studentNumber'
      >,
      Pick<AttendanceEntity, 'checkOutAt'> {
    checkInAt: AttendanceEntity['checkInAt'] | null;
  }
}
