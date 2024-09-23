import { Test, TestingModule } from '@nestjs/testing';
import { StudentRepository } from '../student.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StudentEntity } from '../entity/students.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { Student } from '@prisma/client';
import { studentSeed } from 'test/util/seed/student-seed';
import { parentSeed } from 'test/util/seed/parent-seed';

describe('StudentRepository Test', () => {
  let studentRepository: StudentRepository;
  let prisma: PrismaService;
  let findFirstStudent: Student;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [StudentRepository],
    }).compile();

    studentRepository = module.get<StudentRepository>(StudentRepository);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.$transaction(async (tx) => {
      const students = await studentSeed(tx);

      await parentSeed(students, tx);
    });
  });

  beforeEach(async () => {
    findFirstStudent = await prisma.student.findFirstOrThrow({});
  });

  afterEach(async () => {
    await prisma.$transaction(async (tx) => {
      await tx.parent.deleteMany();
      await tx.student.deleteMany();
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createStudent', () => {
    it('학생 엔티티를 받아 학생을 생성하고 생성된 학생 엔티티를 반환한다', async () => {
      // given
      const student = StudentEntity.create({
        name: 'name1',
        birthDate: new Date(),
        email: 'email@email.com',
        gender: 'male',
        phoneNumber: '01011111111',
        school: 'highschool',
        studentNumber: '1124',
        type: 'STUDENT',
      });

      // when
      const act = await studentRepository.createStudent(student);

      // then
      expect(act).toBeInstanceOf(StudentEntity);
    });
  });

  describe('findStudentByIdx', () => {
    it('학생의 인덱스를 받아 해당하는 학생의 엔티티를 반환한다.', async () => {
      // given

      // when
      const act = await studentRepository.findStudentByIdx(
        findFirstStudent.idx,
      );

      // then
      expect(act).toBeInstanceOf(StudentEntity);
    });

    it('만약 존재하지 않는 학생의 인덱스를 받으면 null을 반환한다', async () => {
      // given
      const studentIdx = 100;

      // when
      const act = await studentRepository.findStudentByIdx(studentIdx);

      // then
      expect(act).toBeNull();
    });
  });

  describe('checkDuplicateStudentNumber', () => {
    it('중복된 학번이 존재하면 true를 반환한다.', async () => {
      // given
      const studentNumber = '1234';

      // when
      const act =
        await studentRepository.checkDuplicateStudentNumber(studentNumber);

      // then
      expect(act).toBeTruthy();
    });

    it('중복된 학번이 존재하지 않으면 false를 반환한다.', async () => {
      // given
      const studentNumber = '9999';

      // when
      const act =
        await studentRepository.checkDuplicateStudentNumber(studentNumber);

      // then
      expect(act).toBeFalsy();
    });
  });

  describe('updateStudent', () => {
    it('주어진 학생 인덱스를 기반으로 변경된 학생 정보를 업데이트한다', async () => {
      // given
      const updatedData = {
        name: 'name update',
      };

      // when
      const act = await studentRepository.updateStudent(
        findFirstStudent.idx,
        updatedData,
      );

      // then
      expect(act).toBeInstanceOf(StudentEntity);
      expect(act.name).toBe(updatedData.name);
      expect(act.name).not.toBe(findFirstStudent.name);
      expect(act.school).toBe(findFirstStudent.school);
    });
  });

  describe('findStudentByStudentNumber', () => {
    it('학생 번호를 받아 해당하는 학생 엔티티를 반환한다', async () => {
      // given
      const studentNumber = '1234';

      // when
      const act =
        await studentRepository.findStudentByStudentNumber(studentNumber);

      // then
      expect(act).toBeInstanceOf(StudentEntity);
    });

    it('만약 해당하는 학생 번호가 없을 경우, null을 반환한다', async () => {
      // given
      const studentNumber = '4321';

      // when
      const act =
        await studentRepository.findStudentByStudentNumber(studentNumber);

      // then
      expect(act).toBeNull();
    });
  });
});
