import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ParseNumberStringPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (isNaN(Number(value))) {
      throw new BadRequestException('Not convertible string to number');
    }

    return value;
  }
}
