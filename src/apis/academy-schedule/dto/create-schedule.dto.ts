import { PickType } from '@nestjs/swagger';
import { AcademyScheduleEntity } from '../entity/academy-schedule.entity';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DayOfWeek } from 'src/utils/enum/day-of-week.enum';
import { Type } from 'class-transformer';
import { IsStartBeforeEnd } from 'src/validations/start-before.validation';
import { IsDayOfWeek } from 'src/validations/date-of-week.validation';

export class ScheduleCreateRequestDto extends PickType(AcademyScheduleEntity, [
  'studentIdx',
  'academyName',
  'daysOfWeek',
  'startedAt',
  'endedAt',
]) {
  @IsNotEmpty()
  @IsNumber()
  studentIdx: number;

  @IsNotEmpty()
  @IsString()
  academyName: string;

  @IsNotEmpty()
  @IsDayOfWeek()
  daysOfWeek: DayOfWeek;

  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  @IsStartBeforeEnd('endedAt')
  startedAt: Date;

  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  endedAt: Date;

  toEntity(): AcademyScheduleEntity {
    return AcademyScheduleEntity.create(this);
  }
}

export class ScheduleCreateResponseDto extends PickType(AcademyScheduleEntity, [
  'idx',
]) {
  /**
   * 생성된 스케쥴 인덱스
   */
  idx: number;

  static from(schedule: AcademyScheduleEntity): ScheduleCreateResponseDto {
    return new ScheduleCreateResponseDto(schedule);
  }
}
