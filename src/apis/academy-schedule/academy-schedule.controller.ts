import { Controller } from '@nestjs/common';
import { AcademyScheduleService } from './academy-schedule.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AcademySchedule')
@Controller('academy-schedule')
export class AcademyScheduleController {
  constructor(
    private readonly academyScheduleService: AcademyScheduleService,
  ) {}
}
