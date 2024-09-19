import { AcademySchedule } from '@prisma/client';
import { DayOfWeek } from 'src/utils/enum/day-of-week.enum';

export class AcademyScheduleEntity {
  /**
   * 일정 인덱스
   */
  idx: number;

  /**
   * studentIdx 학생 인덱스
   *
   * @example 1
   */
  studentIdx: number;

  /**
   * 학원 이름
   *
   * @example '유동산수학학원'
   */
  academyName: string;

  /**
   * 요일 비트마스킹
   *
   * @example 1(월요일) | 2(화요일) | 4(수요일) | 8(목요일) | 16(금요일) | 32(토요일) | 64(일요일)
   */
  daysOfWeek: DayOfWeek;

  /**
   * 시작 시간
   *
   * @example 2021-01-01T09:00:00
   */
  startedAt: Date;

  /**
   * 종료 시간
   *
   * @example 2021-01-01T18:00:00
   */
  endedAt: Date;

  /**
   * 생성일
   */
  createdAt: Date;

  /**
   * 수정일
   */
  updatedAt: Date;

  static create(
    args: IAcademySchedule.ICreateAcademySchedule,
  ): AcademyScheduleEntity {
    const academySchedule = new AcademyScheduleEntity();
    academySchedule.studentIdx = args.studentIdx;
    academySchedule.academyName = args.academyName;
    academySchedule.daysOfWeek = args.daysOfWeek;
    academySchedule.startedAt = args.startedAt;
    academySchedule.endedAt = args.endedAt;

    return academySchedule;
  }

  static update(
    args: IAcademySchedule.IUpdateAcademySchedule,
  ): Partial<AcademyScheduleEntity> {
    const academySchedule = new AcademyScheduleEntity();
    Object.assign(academySchedule, args);

    return academySchedule;
  }

  static from(args: AcademySchedule): AcademyScheduleEntity {
    const academySchedule = new AcademyScheduleEntity();
    academySchedule.idx = args.idx;
    academySchedule.studentIdx = args.studentIdx;
    academySchedule.academyName = args.academyName;
    academySchedule.daysOfWeek = args.daysOfWeek;
    academySchedule.startedAt = args.startedAt;
    academySchedule.endedAt = args.endedAt;
    academySchedule.createdAt = args.createdAt;
    academySchedule.updatedAt = args.updatedAt;

    return academySchedule;
  }
}

export namespace IAcademySchedule {
  export interface ICreateAcademySchedule
    extends Pick<
      AcademyScheduleEntity,
      'studentIdx' | 'academyName' | 'daysOfWeek' | 'startedAt' | 'endedAt'
    > {}

  export interface IUpdateAcademySchedule
    extends Partial<IAcademySchedule.ICreateAcademySchedule> {}
}
