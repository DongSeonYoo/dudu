import { Test, TestingModule } from '@nestjs/testing';
import { StudentRepository } from '../student.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StudentEntity } from '../entity/students.entity';
import { $Enums, Prisma, Student } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

describe('StudentRepository Test', () => {
  let studentRepository: StudentRepository;
  let prisma: PrismaService;

  const studentSeedList = [
    {
      idx: 1,
      name: '홍길동',
      studentNumber: '1234',
      birthDate: new Date('2000-01-01'),
      email: 'email1@naver.com',
      phoneNumber: '01012345678',
      gender: 'male',
      school: 'school',
      type: $Enums.TYPE.STUDENT,
    },
    {
      idx: 2,
      name: '홍길동2',
      studentNumber: '2234',
      birthDate: new Date('2000-01-01'),
      email: 'email2@naver.com',
      phoneNumber: '01012345678',
      gender: 'male',
      school: 'school',
      type: $Enums.TYPE.STUDENT,
    },
    {
      idx: 3,
      name: '홍길동3',
      studentNumber: '3234',
      birthDate: new Date('2000-01-01'),
      email: 'email3@naver.com',
      phoneNumber: '01012345678',
      gender: 'male',
      school: 'school',
      type: $Enums.TYPE.STUDENT,
    },
  ];

  async function seedStudents(studentList: Prisma.StudentCreateInput[]) {
    await prisma.student.createMany({
      data: studentList,
    });
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [StudentRepository],
    }).compile();

    studentRepository = module.get<StudentRepository>(StudentRepository);
    prisma = module.get<PrismaService>(PrismaService);

    await seedStudents(studentSeedList);
  });

  afterAll(async () => {
    await prisma.student.deleteMany({});

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
      const studentIdx = 1;

      // when
      const act = await studentRepository.findStudentByIdx(studentIdx);

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
      const studentIdx = 1;
      const updatedData = {
        name: 'name update',
      };

      // when
      const act = await studentRepository.updateStudent(
        studentIdx,
        updatedData,
      );

      // then
      expect(act).toBeInstanceOf(StudentEntity);
      expect(act.name).toBe(updatedData.name);
      expect(act.name).not.toBe(studentSeedList[0].name);
      expect(act.school).toBe(studentSeedList[0].school);
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
