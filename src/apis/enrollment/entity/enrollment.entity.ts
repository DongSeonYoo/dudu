import { Enrollment } from '@prisma/client';
import { StudentEntity } from 'src/apis/students/entity/students.entity';

export class EnrollmentEntity {
  /**
   * 등록 인덱스
   *
   * @example 1
   */
  idx: number;

  /**
   * 학생 인덱스
   *
   * @example 1
   */
  studentIdx: StudentEntity['idx'];

  /**
   * 등록 시작 일
   *
   * @example 2021-10-20T00:00:00
   */
  startedAt: Date;

  /**
   * 등록 종료 일
   *
   * @example 2021-10-20T00:00:00
   */
  endedAt: Date;

  /**
   * 비용 (재수생: 65, 재학생 53)
   *
   * @example 100000
   */
  amount: number;

  /**
   * 생성 일
   *
   * @example 2021-10-20T00:00:00
   */
  createdAt: Date;

  /**
   * 최근 수정 일
   *
   * @example 2021-10-20T00:00:00
   */
  updatedAt: Date;

  static create(args: IEnrollment.ICreateEnrollment): EnrollmentEntity {
    const enrollment = new EnrollmentEntity();
    enrollment.amount = args.amount;
    enrollment.startedAt = args.startedAt;
    enrollment.endedAt = args.endedAt;

    return enrollment;
  }

  static update(
    args: IEnrollment.IUpdateEnrollment,
  ): Partial<EnrollmentEntity> {
    const updateEnrollmentEntity = new EnrollmentEntity();
    Object.assign(updateEnrollmentEntity, args);

    return updateEnrollmentEntity;
  }

  static from(args: Enrollment): EnrollmentEntity {
    const enrollment = new EnrollmentEntity();
    Object.assign(enrollment, args);

    return enrollment;
  }
}

export namespace IEnrollment {
  export interface ICreateEnrollment
    extends Pick<EnrollmentEntity, 'startedAt' | 'endedAt' | 'amount'> {}

  export interface IUpdateEnrollment extends Partial<ICreateEnrollment> {}
}
