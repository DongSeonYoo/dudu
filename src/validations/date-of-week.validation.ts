import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { InvalidDayOfWeekException } from 'src/exceptions/invalid-day-of-week.exception';
import { DayOfWeek } from 'src/utils/enum/day-of-week.enum';

@ValidatorConstraint({ name: 'isDayOfWeek', async: false })
class IsDayOfWeekConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return Object.values(DayOfWeek).includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    throw new InvalidDayOfWeekException();

    return '';
  }
}

export function IsDayOfWeek(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDayOfWeek',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsDayOfWeekConstraint,
    });
  };
}
