import { Injectable } from '@nestjs/common';
import { IEnrollment } from './entity/enrollment.entity';
import { $Enums } from '@prisma/client';
import { DateUtilService } from 'src/utils/date-util/date-util.service';

@Injectable()
export class EnrollmentService {
  private readonly _STUDENT_AMOUNT = 650000;
  private readonly _REAPEATER_AMOUNT = 500000;
  private readonly _DEFAULT_ENROLLMENT_PERIOD = 30;
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
        this._DEFAULT_ENROLLMENT_PERIOD * month,
      ),
    };
  }

  private calculateAmount(type: $Enums.TYPE): number {
    return type === 'REAPEATER' ? this._REAPEATER_AMOUNT : this._STUDENT_AMOUNT;
  }

  get STUDENT_AMOUNT(): number {
    return this._STUDENT_AMOUNT;
  }

  get REAPEATER_AMOUNT(): number {
    return this._REAPEATER_AMOUNT;
  }
}
