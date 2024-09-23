import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnrollmentRepository } from '../entollment.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Student } from '@prisma/client';
import { EnrollmentEntity } from '../entity/enrollment.entity';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { studentSeed } from 'test/util/seed/student-seed';

describe('EnrollmentRepository Test', () => {
  let prisma: PrismaService;
  let enrollmentRepository: EnrollmentRepository;
  let createdStudentList: Student[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [EnrollmentRepository],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    enrollmentRepository =
      module.get<EnrollmentRepository>(EnrollmentRepository);

    await prisma.$transaction(async (tx) => {
      createdStudentList = await studentSeed(tx);
    });
  });

  afterEach(async () => {
    await prisma.$transaction([
      prisma.enrollment.deleteMany(),
      prisma.student.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createEnrollment', () => {
    const enrollment = EnrollmentEntity.create({
      amount: 530000,
      startedAt: new Date('2020-06-12'),
      endedAt: new Date('202-07-11'),
    });
    it('동일 학생에 대한 중복 등록 시 에러가 발생한다', async () => {
      const studentIdx = createdStudentList[0].idx;
      await enrollmentRepository.createEnrollment(studentIdx, enrollment);

      await expect(
        enrollmentRepository.createEnrollment(studentIdx, enrollment),
      ).rejects.toThrow(PrismaClientKnownRequestError);
    });

    it('트랜잭션 내에서 등록 정보를 생성한다', async () => {
      const studentIdx = createdStudentList[1].idx;

      await prisma.$transaction(async (tx) => {
        const result = await enrollmentRepository.createEnrollment(
          studentIdx,
          enrollment,
          tx,
        );
        expect(result).toBeInstanceOf(EnrollmentEntity);
      });

      const createdEnrollment = await prisma.enrollment.findFirst({
        where: { studentIdx },
      });
      expect(createdEnrollment).toBeDefined();
    });

    it('최대 금액을 초과하는 등록 시 에러가 발생한다', async () => {});

    it('학생 인덱스를 가지고 등록 정보를 생성한다', async () => {
      // given
      const studentIdx = createdStudentList[0].idx;

      // when
      const spy = jest.spyOn(prisma.enrollment, 'create');
      const act = await enrollmentRepository.createEnrollment(
        studentIdx,
        enrollment,
      );

      // then
      expect(spy).toHaveBeenCalled();
      expect(act).toBeInstanceOf(EnrollmentEntity);
      expect(act.amount).toBe(enrollment.amount);
      expect(act.startedAt).toStrictEqual(enrollment.startedAt);
      expect(act.endedAt).toStrictEqual(enrollment.endedAt);
    });

    it('존재하지 않는 학생 인덱스인 경우 PrismaClientKnownRequestError가 발생한다', async () => {
      // given
      const notExistStudentIdx = 999;

      // when
      const act = async () =>
        await enrollmentRepository.createEnrollment(
          notExistStudentIdx,
          enrollment,
        );

      // then
      await expect(act).rejects.toThrow(PrismaClientKnownRequestError);
    });
  });
});
