import { Controller, Post } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Enrollment')
@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}
}