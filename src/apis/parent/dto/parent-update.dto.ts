import { OmitType, PartialType } from '@nestjs/swagger';
import { ParentDto } from './parent.dto';
import { IsNumberString, Length } from 'class-validator';
import { ParentEntity } from '../entity/parent.entity';

export class UpdateParentRequestDto extends PartialType(
  OmitType(ParentDto, ['toEntity']),
) {
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
      name: this.name,
      phoneNumber: this.phoneNumber,
    };
  }
}
