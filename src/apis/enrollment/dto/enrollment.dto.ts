import { PickType } from '@nestjs/swagger';
import { EnrollmentEntity, IEnrollment } from '../entity/enrollment.entity';
import { IsDate, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { StartedAtEndedAtValidation } from 'src/validation/started-ended.validation';
import { $Enums } from '@prisma/client';

export class EnrollmentCreateRequestDto extends PickType(EnrollmentEntity, [
  'startedAt',
]) {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Validate(StartedAtEndedAtValidation)
  startedAt: Date;

  /**
   * 등록할 기간 (달)
   *
   * month 사실 필요없을듯? startedAt, endedAt으로 계산 가능할듯
   * dateUtilService클래스에서 커스텀 함수로 만들어서 사용하면 될뜼?
   *
   * @example 1
   * @default 1
   */
  @IsOptional()
  month: number = 1;

  toEntity(args: IEnrollment.ICreateEnrollment): EnrollmentEntity {
    return EnrollmentEntity.create(args);
  }
}
