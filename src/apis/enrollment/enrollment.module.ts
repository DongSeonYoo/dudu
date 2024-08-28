import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentRepository } from './entollment.repository';

@Module({
  exports: [EnrollmentService],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EnrollmentRepository],
})
export class EnrollmentModule {}
