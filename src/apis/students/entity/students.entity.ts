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
   * @example ['STUDENT', 'REAPEATER']
   */
  type: $Enums.TYPE;

  /**
   * 학생 성별
   *
   * @example 남 | 여
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

  constructor(data: Partial<StudentEntity>) {
    Object.assign(this, data);
  }

  static from(data: Student): StudentEntity {
    return new StudentEntity({
      idx: data.idx,
      type: data.type,
      birthDate: data.birthDate,
      createdAt: data.createdAt,
      email: data.email,
      gender: data.gender,
      name: data.name,
      phoneNumber: data.phoneNumber,
      school: data.school,
      studentNumber: data.studentNumber,
      updatedAt: data.updatedAt,
    });
  }
}
