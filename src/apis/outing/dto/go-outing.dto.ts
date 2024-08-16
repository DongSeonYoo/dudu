import { PickType } from '@nestjs/swagger';
import { OutingEntity } from '../entity/outing.entity';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class GoOutingRequestDto extends PickType(OutingEntity, [
  'studentIdx',
  'attendanceIdx',
  'reason',
  'startedTime',
  'endedTime',
]) {
  @IsNotEmpty()
  @IsNumber()
  studentIdx: number;

  @IsNotEmpty()
  @IsNumber()
  attendanceIdx: number;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  // @IsDateString()
  @Matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
  startedTime: Date;

  @IsNotEmpty()
  // @IsDateString()
  @Matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
  endedTime: Date;

  toEntity(): OutingEntity {
    const outing = OutingEntity.create({
      studentIdx: this.studentIdx,
      attendanceIdx: this.attendanceIdx,
      reason: this.reason,
      startedTime: this.startedTime,
      endedTime: this.endedTime,
    });

    return outing;
  }
}
