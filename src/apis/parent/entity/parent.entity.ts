import { Parent } from '@prisma/client';
import { StudentEntity } from 'src/apis/students/entity/students.entity';

export class ParentEntity {
  /**
   * 학부모 인덱스
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
   * 학부모 이름
   *
   * @example 유동선 부
   */
  name: string;

  /**
   * 학부모 전화번호
   *
   * @example 01036261552
   */
  phoneNumber: string;

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

  static create(args: Pick<Parent, 'name' | 'phoneNumber'>): ParentEntity {
    const parent = new ParentEntity();
    parent.name = args.name;
    parent.phoneNumber = args.phoneNumber;

    return parent;
  }

  static update(
    args: Partial<Pick<ParentEntity, 'name' | 'phoneNumber'>>,
  ): Partial<ParentEntity> {
    const updateParentEntity = new ParentEntity();
    Object.assign(updateParentEntity, args);

    return updateParentEntity;
  }

  static from(args: Parent): ParentEntity {
    const parent = new ParentEntity();
    parent.idx = args.idx;
    parent.studentIdx = args.studentIdx;
    parent.name = args.name;
    parent.phoneNumber = args.phoneNumber;
    parent.createdAt = args.createdAt;
    parent.updatedAt = args.updatedAt;

    return parent;
  }
}
