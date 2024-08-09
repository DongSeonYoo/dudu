import { PartialType } from '@nestjs/swagger';
import { ParentDto } from './parent.dto';
import { ParentEntity } from '../entity/parent.entity';
import { IsNumberString, Length } from 'class-validator';

export class UpdateParentRequestDto extends PartialType(ParentDto) {
  /**
   * 학부모 이름
   *
   * @example 홍길동 모
   */
  name?: string | undefined;

  /**
   * 학부모 전화번호
   *
   * @example 01012345678
   */
  @IsNumberString()
  @Length(11, 11)
  phoneNumber?: string | undefined;

  toEntity(): Partial<ParentEntity> {
    return {
      ...this,
    };
  }
}
