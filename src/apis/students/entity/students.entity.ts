import { $Enums, Student } from '@prisma/client';

export class StudentEntity {
  /**
   * 학생 인덱스
   *
   * @example 1
   */
  idx: number;

  /**
   * 학생 타입 (재학생 or 재수생)
   *
   * @example 'STUDENT'
   */
  type: $Enums.TYPE;

  /**
   * 학생 성별
   *
   * @example '남'
   */
  gender: string;

  /**
   * 학교 이름

  @example 송도고등학교
   */
  school: string;

  /**
   * 학생 이름
   *
   * @example 유동선
   */
  name: string;

  /**
   * 전화번호
   *
   * @example 01036261552
   */
  phoneNumber: string;

  /**
   * 이메일
   *
   * @example inko51366@naver.com
   */
  email: string | null;

  /**
   * 학생 고유 번호 4자리
   *
   * @example 1234
   */
  studentNumber: string;

  /**
   * 학생 생년월일
   *
   * @example 2001-06-12
   */
  birthDate: Date;

  /**
   * 생성 일
   *
   * @example 2025-05-07T12:00:00.000Z
   */
  createdAt: Date;

  /**
   *
   * 수정 일
   *
   * @example 2025-05-07T12:00:00.000Z
   */
  updatedAt: Date;

  static create(args: IStudent.ICreateStudentRequest): StudentEntity {
    const student = new StudentEntity();
    student.type = args.type;
    student.gender = args.gender;
    student.school = args.school;
    student.name = args.name;
    student.phoneNumber = args.phoneNumber;
    student.email = args.email;
    student.studentNumber = args.studentNumber;
    student.birthDate = args.birthDate;

    return student;
  }

  static update(args: IStudent.IUpdateStudentRequest): Partial<StudentEntity> {
    const updateStudentEntity = new StudentEntity();
    Object.assign(this, args);

    return updateStudentEntity;
  }

  static from(args: Student): StudentEntity {
    const student = new StudentEntity();
    student.idx = args.idx;
    student.type = args.type;
    student.gender = args.gender;
    student.school = args.school;
    student.name = args.name;
    student.phoneNumber = args.phoneNumber;
    student.email = args.email;
    student.studentNumber = args.studentNumber;
    student.birthDate = args.birthDate;
    student.createdAt = args.createdAt;
    student.updatedAt = args.updatedAt;

    return student;
  }
}

export namespace IStudent {
  export interface ICreateStudentRequest
    extends Pick<
      StudentEntity,
      | 'type'
      | 'gender'
      | 'school'
      | 'name'
      | 'phoneNumber'
      | 'email'
      | 'studentNumber'
      | 'birthDate'
    > {}

  export interface IUpdateStudentRequest
    extends Partial<ICreateStudentRequest> {}

  export interface IDetailStudentResponse {
    idx: number;
    type: $Enums.TYPE;
    gender: string;
    school: string;
    name: string;
    phoneNumber: string;
    email: string | null;
    studentNumber: string;
    birthDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }
}
