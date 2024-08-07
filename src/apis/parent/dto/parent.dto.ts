import { PickType } from '@nestjs/swagger';
import { ParentEntity } from '../entity/parent.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class ParentDto extends PickType(ParentEntity, ['name', 'phoneNumber']) {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
