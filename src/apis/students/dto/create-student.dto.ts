import { IntersectionType, PickType } from '@nestjs/swagger';
import { StudentEntity } from '../entity/students.entity';
import { $Enums } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ParentEntity } from 'src/apis/parent/entity/parent.entity';
import { ParentDto } from 'src/apis/parent/dto/parent.dto';

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

  @ValidateNested()
  @Type(() => ParentDto)
  parent: ParentDto;

  toEntity(): { studentEntity: StudentEntity; parentEntity: ParentEntity } {
    return {
      studentEntity: new StudentEntity({
        type: this.type,
        gender: this.gender,
        school: this.school,
        name: this.name,
        phoneNumber: this.phoneNumber,
        email: this.email,
        studentNumber: this.studentNumber,
        birthDate: this.birthDate,
      }),
      parentEntity: new ParentEntity({
        name: this.parent.name,
        phoneNumber: this.parent.phoneNumber,
      }),
    };
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
