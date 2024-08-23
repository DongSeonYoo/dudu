import { IStudent, StudentEntity } from '../entity/students.entity';

export class StudentDetailResponseDto extends StudentEntity {
  constructor(args: IStudent.IDetailStudentResponse) {
    super();
    Object.assign(this, args);
  }

  static of(student: StudentEntity): StudentDetailResponseDto {
    return new StudentDetailResponseDto(student);
  }
}
