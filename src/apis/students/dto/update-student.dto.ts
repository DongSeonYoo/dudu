import { OmitType, PartialType } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { CreateStudentRequestDto } from './create-student.dto';
import { StudentEntity } from '../entity/students.entity';

export class UpdateStudentRequestDto extends PartialType(
  OmitType(CreateStudentRequestDto, ['parent', 'toEntity']),
) {
  /**
   * 학생 타입 (재학생 or 재수생)
   *
   * @example ['STUDENT', 'REAPEATER']
   */
  type?: $Enums.TYPE | undefined;

  /**
   * 성별
   *
   * @example 남 | 여
   */
  gender?: string | undefined;

  /**
   * 학교 이름
   *
   * @example 송도고등학교
   */
  school?: string | undefined;

  /**
   * 이름
   *
   * @example 유동선
   */
  name?: string | undefined;

  /**
   * 전화번호
   *
   * @example 01036261552
   */
  phoneNumber?: string | undefined;

  /**
   * 이메일
   *
   * @example
   */
  email?: string | null | undefined;

  /**
   * 학생 고유 번호 4자리
   *
   * @example 1234
   */
  studentNumber?: string | undefined;

  /**
   * 생년월일
   *
   * @example 1995-12-25
   */
  birthDate?: Date | undefined;

  toEntity(): Partial<StudentEntity> {
    return {
      ...this,
    };
  }
}
