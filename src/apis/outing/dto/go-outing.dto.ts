import { PickType } from '@nestjs/swagger';
import { OutingEntity } from '../entity/outing.entity';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { IsStartBeforeEnd } from 'src/validations/start-before.validation';

export class GoOutingRequestDto extends PickType(OutingEntity, [
  'studentIdx',
  'reason',
  'startedAt',
  'endedAt',
]) {
  @IsNotEmpty()
  @IsNumber()
  studentIdx: number;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  @IsStartBeforeEnd('endedAt')
  startedAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endedAt: Date;

  toEntity(attendanceIdx: number): OutingEntity {
    const outing = OutingEntity.create({
      studentIdx: this.studentIdx,
      attendanceIdx: attendanceIdx,
      reason: this.reason,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
    });

    return outing;
  }
}
