import { PickType } from '@nestjs/swagger';
import {
  AcademyScheduleEntity,
  IAcademySchedule,
} from '../entity/academy-schedule.entity';

export class ScheduleCreateRequestDto extends PickType(AcademyScheduleEntity, [
  'studentIdx',
  'academyName',
  'daysOfWeek',
  'startedAt',
  'endedAt',
]) {
  toEntity(): AcademyScheduleEntity {
    return AcademyScheduleEntity.create({
      ...this,
    });
  }
}
