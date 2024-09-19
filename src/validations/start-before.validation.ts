import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { StratedAtEndedAtException } from 'src/exceptions/started-ended-at.exception';

@ValidatorConstraint({ name: 'isStartBeforeEnd', async: false })
class IsStartBeforeEndConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value < relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    throw new StratedAtEndedAtException();

    return '';
  }
}

export function IsStartBeforeEnd(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStartBeforeEnd',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsStartBeforeEndConstraint,
    });
  };
}
