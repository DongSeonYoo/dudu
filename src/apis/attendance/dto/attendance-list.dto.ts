import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { StudentEntity } from 'src/apis/students/entity/students.entity';
import { AttendanceEntity, IAttendance } from '../entity/attendance.entity';
import { Transform } from 'class-transformer';

export class AttendanceListRequestDto {
  @ApiProperty({
    description: '날짜 (YYYY-MM-DD)',
    example: '2024-08-15',
    required: false,
    default: '오늘 날짜',
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  date: Date;
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
