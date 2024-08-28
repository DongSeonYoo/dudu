import { PickType } from '@nestjs/swagger';
import { StudentEntity } from '../entity/students.entity';
import { $Enums } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ParentDto } from 'src/apis/parent/dto/parent.dto';
import { EnrollmentCreateRequestDto } from 'src/apis/enrollment/dto/enrollment.dto';

export class CreateStudentRequestDto extends PickType(StudentEntity, [
  'type',
  'gender',
  'school',
  'name',
  'phoneNumber',
  'email',
  'studentNumber',
  'birthDate',
]) {
  @IsEnum($Enums.TYPE)
  @IsNotEmpty()
  type: $Enums.TYPE;

  @IsNotEmpty()
  @IsIn(['남', '여'])
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
  @IsOptional()
  email: string | null;

  @IsNotEmpty()
  @IsNumberString()
  @Length(4, 4)
  studentNumber: string;

  @ValidateNested()
  @Type(() => ParentDto)
  parent: ParentDto;

  @ValidateNested()
  @Type(() => EnrollmentCreateRequestDto)
  enrollment: EnrollmentCreateRequestDto;

  toEntity(): StudentEntity {
    const student = StudentEntity.create({
      type: this.type,
      gender: this.gender,
      school: this.school,
      name: this.name,
      phoneNumber: this.phoneNumber,
      email: this.email,
      studentNumber: this.studentNumber,
      birthDate: this.birthDate,
    });

    return student;
  }
}

export class CreateStudentResponseDto extends PickType(StudentEntity, ['idx']) {
  /**
   * 생성된 학생 인덱스
   *
   * @example 1
   */
  idx: number;

  constructor(idx: number) {
    super();
    this.idx = idx;
  }

  static of(student: StudentEntity): CreateStudentResponseDto {
    return new CreateStudentResponseDto(student.idx);
  }
}
