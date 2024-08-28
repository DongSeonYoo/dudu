import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * 1. startedAt은 현재 시간보다 이후여야 함.
 * 2. startedAt은 endedAt보다 이전이어야 함.
 */
@ValidatorConstraint({ name: 'EnrollmentDateValidation', async: false })
export class StartedAtEndedAtValidation
  implements ValidatorConstraintInterface
{
  validate(value: any, validationArguments?: ValidationArguments): any {
    const startedAt = value as Date;
    const endedAt = validationArguments?.object['endedAt'] as Date;

    if (startedAt < new Date()) {
      return false;
    }

    if (startedAt >= endedAt) {
      return false;
    }

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'startedAt은 현재 시간보다 이후여야 하며, endedAt보다 이전이어야 합니다.';
  }
}
