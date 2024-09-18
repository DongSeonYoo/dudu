import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { NumberStringException } from 'src/exceptions/number-string.exception';

export class ParseNumberStringPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (isNaN(Number(value))) {
      throw new NumberStringException();
    }

    return value;
  }
}
