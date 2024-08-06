import { StudentEntity } from '../entity/students.entity';

export class StudentDetailResponseDto extends StudentEntity {
  static of(student: StudentEntity): StudentDetailResponseDto {
    return {
      ...student,
    };
  }
}
