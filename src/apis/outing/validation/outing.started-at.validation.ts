import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * 1. outing.startedAt은 현재 시간보다 이후여야 함.
 * 2. outing.startedAt은 outing.endedAt보다 이전이어야 함.
 */
@ValidatorConstraint({ name: 'OutingStartedAtValidation', async: false })
export class OutingStartedAtValidation implements ValidatorConstraintInterface {
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
    console.log(validationArguments);
    return '외출 시작 시간은 현재 시간보다 이후이어야 하며, 외출 종료 시간보다 이전이어야 합니다';
  }
}
