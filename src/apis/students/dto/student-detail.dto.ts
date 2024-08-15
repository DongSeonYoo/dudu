import { IStudent, StudentEntity } from '../entity/students.entity';

export class StudentDetailResponseDto extends StudentEntity {
  constructor(args: IStudent.IDetailStudentResponse) {
    super();
    this.idx = args.idx;
    this.type = args.type;
    this.gender = args.gender;
    this.school = args.school;
    this.name = args.name;
    this.phoneNumber = args.phoneNumber;
    this.email = args.email;
    this.studentNumber = args.studentNumber;
    this.birthDate = args.birthDate;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  static of(student: StudentEntity): StudentDetailResponseDto {
    return new StudentDetailResponseDto(student);
  }
}
