export class OutingEntity {
  /**
   * 학생 idx
   *
   * @example 1
   */
  studentIdx: number;

  /**
   * 외출 idx
   *
   * @example 1
   */
  attendanceIdx: number;

  /**
   * 외출 사유
   *
   * @example '병원'
   */
  reason: string;

  /**
   * 외출 시작 시간
   *
   * @example 2024-07-01T12:00:00
   */
  startedAt: Date;

  /**
   * 외출 종료 시간
   *
   * @example 2024-07-01T12:30:00
   */
  endedAt: Date;

  /**
   * 생성 일
   *
   * @example 2021-07-01T00:00:00
   */
  createdAt: Date;

  /**
   * 수정 일
   *
   * @example 2021-07-01T00:00:00
   */
  updatedAt: Date;

  static create(args: IOuting.ICreateOuting): OutingEntity {
    const outing = new OutingEntity();
    outing.attendanceIdx = args.attendanceIdx;
    outing.studentIdx = args.studentIdx;
    outing.reason = args.reason;
    outing.startedAt = args.startedAt;
    outing.endedAt = args.endedAt;

    return outing;
  }
}

export namespace IOuting {
  export interface ICreateOuting
    extends Pick<
      OutingEntity,
      'studentIdx' | 'attendanceIdx' | 'reason' | 'startedAt' | 'endedAt'
    > {}
}
