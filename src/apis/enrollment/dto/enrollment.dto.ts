import { PickType } from '@nestjs/swagger';
import { EnrollmentEntity, IEnrollment } from '../entity/enrollment.entity';
import { IsDate, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class EnrollmentCreateRequestDto extends PickType(EnrollmentEntity, [
  'startedAt',
]) {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startedAt: Date;

  /**
   * 등록할 기간 (달)
   *
   * @example 1
   * @default 1
   */
  @IsOptional()
  @Min(1)
  @Max(12)
  month: number = 1;

  toEntity(args: IEnrollment.ICreateEnrollment): EnrollmentEntity {
    return EnrollmentEntity.create(args);
  }
}
