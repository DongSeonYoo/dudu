import { Injectable } from '@nestjs/common';
import { EnrollmentEntity, IEnrollment } from './entity/enrollment.entity';
import { $Enums } from '@prisma/client';
import { DateUtilService } from 'src/utils/date-util/date-util.service';

@Injectable()
export class EnrollmentService {
  private readonly STUDENT_AMOUNT = 650000;
  private readonly REAPEATER_AMOUNT = 500000;
  private readonly DEFAULT_ENROLLMENT_PERIOD = 30;
  constructor(private readonly dateUtilService: DateUtilService) {}

  createEnrollmentInfo(
    type: $Enums.TYPE,
    startedAt: Date,
    month: number,
  ): IEnrollment.ICreateEnrollment {
    return {
      amount: this.calculateAmount(type),
      startedAt: startedAt,
      endedAt: this.dateUtilService.addDays(
        startedAt,
        this.DEFAULT_ENROLLMENT_PERIOD * month,
      ),
    };
  }

  private calculateAmount(type: $Enums.TYPE): number {
    return type === 'REAPEATER' ? this.REAPEATER_AMOUNT : this.STUDENT_AMOUNT;
  }
}
