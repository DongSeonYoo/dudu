import { PickType } from '@nestjs/swagger';
import { StudentEntity } from '../entity/students.entity';
import { $Enums } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateStudentRequestDto extends PickType(StudentEntity, [
  'type',
  'gender',
  'school',
  'name',
  'phoneNumber',
  'email',
  'studentNumber',
  'birthDate',
  'gender',
]) {
  @IsEnum($Enums.TYPE)
  @IsNotEmpty()
  type: $Enums.TYPE;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  school: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  birthDate: Date;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(4, 4)
  studentNumber: string;

  toEntity(): StudentEntity {
    return new StudentEntity({
      ...this,
    });
  }
}

export class CreateStudentResponseDto extends PickType(StudentEntity, ['idx']) {
  /**
   * 생성된 학생 인덱스
   *
   * @example 1
   */
  idx: number;

  static of(student: StudentEntity) {
    return {
      idx: student.idx,
    };
  }
}
