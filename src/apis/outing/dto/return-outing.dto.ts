import { PickType } from '@nestjs/swagger';
import { OutingEntity } from '../entity/outing.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReturnOutingRequestDto extends PickType(OutingEntity, [
  'studentIdx',
  'attendanceIdx',
]) {
  @IsNotEmpty()
  @IsNumber()
  attendanceIdx: number;

  @IsNotEmpty()
  @IsNumber()
  studentIdx: number;
}
