import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AcademyScheduleEntity } from './entity/academy-schedule.entity';

@Injectable()
export class AcademyScheduleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createSchedule(
    schedule: AcademyScheduleEntity,
  ): Promise<AcademyScheduleEntity> {
    const scheduleResult = await this.prismaService.academySchedule.create({
      data: {
        studentIdx: schedule.studentIdx,
        academyName: schedule.academyName,
        daysOfWeek: schedule.daysOfWeek,
        endedAt: schedule.endedAt,
        startedAt: schedule.startedAt,
      },
    });

    return AcademyScheduleEntity.from(scheduleResult);
  }
}
