import { PickType } from '@nestjs/swagger';
import { OutingEntity } from '../entity/outing.entity';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GoOutingRequestDto extends PickType(OutingEntity, [
  'studentIdx',
  'attendanceIdx',
  'reason',
  'startedAt',
  'endedAt',
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
  @IsDate()
  @Type(() => Date)
  startedAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endedAt: Date;

  toEntity(): OutingEntity {
    const outing = OutingEntity.create({
      studentIdx: this.studentIdx,
      attendanceIdx: this.attendanceIdx,
      reason: this.reason,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
    });

    return outing;
  }
}
