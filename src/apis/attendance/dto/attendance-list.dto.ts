import { IntersectionType, PickType } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { StudentEntity } from 'src/apis/students/entity/students.entity';
import { AttendanceEntity } from '../entity/attendance.entity';
import { TYPE } from '@prisma/client';

export class AttendanceListRequestDto {
  /**
   * 조회 할 날짜
   */
  @IsDate()
  @IsOptional()
  date: Date = new Date();
}

export class AttendanceListResponseDto extends IntersectionType(
  PickType(StudentEntity, [
    'idx',
    'name',
    'school',
    'gender',
    'type',
    'studentNumber',
  ]),
  PickType(AttendanceEntity, ['checkOutAt']),
) {
  /**
   * 등원 시간
   *
   * @example 10:00
   */
  checkInAt: Date | null;

  constructor(args: IAttendance.IAttendanceListResponse) {
    super();
    this.idx = args.idx;
    this.name = args.name;
    this.school = args.school;
    this.type = args.type;
    this.gender = args.gender;
    this.studentNumber = args.studentNumber;
    this.checkInAt = args.checkInAt;
    this.checkOutAt = args.checkOutAt;
  }

  static of(
    student: StudentEntity,
    attendance: AttendanceEntity | null,
  ): AttendanceListResponseDto {
    return new AttendanceListResponseDto({
      idx: student.idx,
      name: student.name,
      school: student.school,
      type: student.type,
      gender: student.gender,
      studentNumber: student.studentNumber,
      checkInAt: attendance ? attendance.checkInAt : null,
      checkOutAt: attendance ? attendance.checkOutAt : null,
    });
  }
}
