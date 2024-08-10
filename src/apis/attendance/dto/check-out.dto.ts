import { PickType } from '@nestjs/swagger';
import { AttendanceEntity } from '../entity/attendance.entity';
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class CheckOutRequestDto extends PickType(AttendanceEntity, [
  'studentIdx',
  'checkOutAt',
]) {
  @IsNotEmpty()
  @IsNumber()
  studentIdx: number;

  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/) // regex for HH:mm
  checkOutAt: Date;

  toEntity(): AttendanceEntity {
    const attendace = new AttendanceEntity();
    attendace.studentIdx = this.studentIdx;
    attendace.checkInAt = this.checkOutAt;

    return attendace;
  }
}
