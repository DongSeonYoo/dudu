import { PickType } from '@nestjs/swagger';
import { AttendanceEntity } from '../entity/attendance.entity';
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class CheckInRequestDto extends PickType(AttendanceEntity, [
  'studentIdx',
  'checkInAt',
]) {
  @IsNotEmpty()
  @IsNumber()
  studentIdx: number;

  @IsNotEmpty()
  // @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/) // regex for HH:mm
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/) // regex for HH:mm
  checkInAt: Date;

  toEntity(): AttendanceEntity {
    const attendace = AttendanceEntity.create({
      checkInAt: this.checkInAt,
      studentIdx: this.studentIdx,
    });

    return attendace;
  }
}
