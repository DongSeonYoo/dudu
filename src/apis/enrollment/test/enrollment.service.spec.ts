import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentService } from '../enrollment.service';
import { DateUtilModule } from 'src/utils/date-util/dtae-util.module';
import { $Enums } from '@prisma/client';

describe('EnrollmentService', () => {
  let enrollmentService: EnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DateUtilModule],
      providers: [EnrollmentService],
    }).compile();

    enrollmentService = module.get<EnrollmentService>(EnrollmentService);
  });

  describe('createEnrollmentInfo', () => {
    let type: $Enums.TYPE;
    let startedAt: Date;
    let month: number;
    let expectedDate: Date;

    it('재학생이 등록할 시, 재학생의 등록 정보를 반환한다', () => {
      // given
      type = 'STUDENT';
      month = 1;
      startedAt = new Date('2024-01-01');
      expectedDate = new Date('2024-01-31');

      // when
      const act = enrollmentService.createEnrollmentInfo(
        type,
        startedAt,
        month,
      );

      // then
      expect(act.amount).toBe(enrollmentService.STUDENT_AMOUNT);
      expect(act.startedAt).toBe(startedAt);
      expect(act.endedAt).toEqual(expectedDate);
    });

    it('재수생이 등록할 시, 재수생의 등록 정보를 반환한다', () => {
      // given
      type = 'REAPEATER';
      month = 1;
      startedAt = new Date('2024-03-15');
      expectedDate = new Date('2024-04-14');

      // when
      const act = enrollmentService.createEnrollmentInfo(
        type,
        startedAt,
        month,
      );

      // then
      expect(act.amount).toBe(enrollmentService.REAPEATER_AMOUNT);
      expect(act.startedAt).toBe(startedAt);
      expect(act.endedAt).toEqual(expectedDate);
    });

    it('2개월을 등록할 시, endedAt은 2개월 후의 날짜이다', () => {
      // given
      type = 'STUDENT';
      month = 2;
      startedAt = new Date('2024-01-01');
      expectedDate = new Date('2024-03-01');

      // when
      const act = enrollmentService.createEnrollmentInfo(
        type,
        startedAt,
        month,
      );

      // then
      expect(act.amount).toBe(enrollmentService.STUDENT_AMOUNT);
      expect(act.startedAt).toBe(startedAt);
      expect(act.endedAt).toEqual(expectedDate);
    });
  });

  describe('Student type에 대한 올바른 등록 금액을 계산을 테스트한다', () => {
    let type: $Enums.TYPE;
    let startedAt: Date;
    let month: number;

    it('STUDENT일 경우 STUDENT_AMOUND로 생성한다', () => {
      // given
      type = 'STUDENT';
      startedAt = new Date('2024-01-01');
      month = 1;

      // when
      const act = enrollmentService.createEnrollmentInfo(
        type,
        startedAt,
        month,
      );

      // then
      expect(act.amount).toBe(enrollmentService.STUDENT_AMOUNT);
    });

    it('REAPEATER 경우 REAPEATER_AMOUNT로 생성한다', () => {
      // given
      type = 'REAPEATER';
      startedAt = new Date('2024-01-01');
      month = 1;

      // when
      const act = enrollmentService.createEnrollmentInfo(
        type,
        startedAt,
        month,
      );

      // then
      expect(act.amount).toBe(enrollmentService.REAPEATER_AMOUNT);
    });
  });
});
