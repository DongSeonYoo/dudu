import { Module } from '@nestjs/common';
import { AcademyScheduleService } from './academy-schedule.service';
import { AcademyScheduleController } from './academy-schedule.controller';

@Module({
  controllers: [AcademyScheduleController],
  providers: [AcademyScheduleService],
})
export class AcademyScheduleModule {}
