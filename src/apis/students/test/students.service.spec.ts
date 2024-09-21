import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from '../students.service';
import { TransactionManager } from 'src/prisma/prisma-transaction.manager';
import { ParentRepository } from 'src/apis/parent/parent.repository';
import { MockProxy, mock } from 'jest-mock-extended';
import { StudentRepository } from '../student.repository';
import { StudentEntity } from '../entity/students.entity';
import {
  CreateStudentRequestDto,
  CreateStudentResponseDto,
} from '../dto/create-student.dto';
import { ParentDto } from 'src/apis/parent/dto/parent.dto';
import { Prisma } from '@prisma/client';
import { ParentEntity } from 'src/apis/parent/entity/parent.entity';
import { StudentDetailResponseDto } from '../dto/student-detail.dto';
import { UpdateStudentRequestDto } from '../dto/update-student.dto';
import { EnrollmentService } from 'src/apis/enrollment/enrollment.service';
import { EnrollmentRepository } from 'src/apis/enrollment/entollment.repository';
import { EnrollmentCreateRequestDto } from 'src/apis/enrollment/dto/enrollment.dto';
import { EnrollmentEntity } from 'src/apis/enrollment/entity/enrollment.entity';
import { StudentNotFoundException } from '../exception/student-not-found.exception';
import { StudentNumberConflictException } from '../exception/student-number-conflict.exception';

describe('StudentsService', () => {
  let studentService: StudentsService;
  let studentRepository: MockProxy<StudentRepository>;
  let transactionManager: MockProxy<TransactionManager>;
  let parentRepository: MockProxy<ParentRepository>;
  let enrollmentService: MockProxy<EnrollmentService>;
  let enrollmentRepository: MockProxy<EnrollmentRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: StudentRepository,
          useFactory: (): StudentRepository => mock<StudentRepository>(),
        },
        {
          provide: TransactionManager,
          useFactory: (): TransactionManager => mock<TransactionManager>(),
        },
        {
          provide: ParentRepository,
          useFactory: (): ParentRepository => mock<ParentRepository>(),
        },
        {
          provide: EnrollmentService,
          useFactory: (): EnrollmentService => mock<EnrollmentService>(),
        },
        {
          provide: EnrollmentRepository,
          useFactory: (): EnrollmentRepository => mock<EnrollmentRepository>(),
        },
      ],
    }).compile();

    studentService = module.get<StudentsService>(StudentsService);
    studentRepository = module.get(StudentRepository);
    transactionManager = module.get(TransactionManager);
    parentRepository = module.get(ParentRepository);
    enrollmentService = module.get(EnrollmentService);
    enrollmentRepository = module.get(EnrollmentRepository);
  });

  describe('checkExistStudent', () => {
    it('학생이 존재할 경우 해당하는 StudentEntity를 반환한다', async () => {
      // given
      const studentIdx = 1;

      // when
      studentRepository.findStudentByIdx.mockResolvedValue(new StudentEntity());
      const act = await studentService.checkExistStudent(studentIdx);

      // then
      expect(act).toBeInstanceOf(StudentEntity);
    });

    it('학생이 존재하지 않을 경우 StudentNotFoundException 발생한다', async () => {
      // given
      const studentIdx = 1;

      // when
      studentRepository.findStudentByIdx.mockResolvedValue(null);
      const act = studentService.checkExistStudent(studentIdx);

      // then
      await expect(act).rejects.toThrow(StudentNotFoundException);
    });
  });

  describe('createStudent', () => {
    const createdStudentIdx = 1;
    let dto: CreateStudentRequestDto;
    let mockTransaction = {} as Prisma.TransactionClient;

    beforeEach(() => {
      dto = new CreateStudentRequestDto();
      dto.type = 'STUDENT';
      dto.gender = '남';
      dto.school = '송도고등학교';
      dto.name = '유동선';
      dto.phoneNumber = '01036261552';
      dto.email = 'inko51366@naver.com';
      dto.studentNumber = '1234';
      dto.birthDate = new Date('2001-06-12');
      dto.parent = new ParentDto();
      dto.parent.name = '유동선 모';
      dto.parent.phoneNumber = '01011111111';
      dto.enrollment = new EnrollmentCreateRequestDto();
      dto.enrollment.startedAt = new Date('2024-01-01');
      dto.enrollment.month = 1;

      mockTransaction = {} as Prisma.TransactionClient;
    });

    it('중복된 학생 번호가 존재하면 StudentNumberConflictException 발생한다', async () => {
      // given
      studentRepository.checkDuplicateStudentNumber.mockResolvedValue(
        {} as StudentEntity,
      );

      // when
      const act = async () => await studentService.createStudent(dto);

      // then
      await expect(act).rejects.toThrow(StudentNumberConflictException);
    });

    it('학생 생성 시 등록 정보를 계산한다', async () => {
      // given
      const mockEnrollmentInfo = {
        amount: 650000,
        startedAt: dto.enrollment.startedAt,
        endedAt: new Date('2024-01-31'),
      };
      studentRepository.checkDuplicateStudentNumber.mockResolvedValue(null);
      enrollmentService.createEnrollmentInfo.mockReturnValue(
        mockEnrollmentInfo,
      );
      transactionManager.runTransaction.mockImplementation(async (cb) =>
        cb(mockTransaction),
      );
      studentRepository.createStudent.mockResolvedValue({
        idx: 1,
      } as StudentEntity);

      // when
      await studentService.createStudent(dto);

      // then
      expect(enrollmentService.createEnrollmentInfo).toHaveBeenCalledWith(
        dto.type,
        dto.enrollment.startedAt,
        dto.enrollment.month,
      );
    });

    it('트랜잭션 내에서 학생과 해당 학생의 부모님, 등록 정보를 저장한다', async () => {
      // given
      studentRepository.checkDuplicateStudentNumber.mockResolvedValue(null);
      transactionManager.runTransaction.mockImplementation(async (cb) =>
        cb(mockTransaction),
      );
      studentRepository.createStudent.mockResolvedValue({
        idx: createdStudentIdx,
      } as StudentEntity);
      enrollmentService.createEnrollmentInfo.mockReturnValue({} as any);

      // when
      await studentService.createStudent(dto);

      // then
      expect(transactionManager.runTransaction).toHaveBeenCalled();
      expect(studentRepository.createStudent).toHaveBeenCalledWith(
        expect.any(StudentEntity),
        mockTransaction,
      );
      expect(parentRepository.createParent).toHaveBeenCalledWith(
        createdStudentIdx,
        expect.any(ParentEntity),
        mockTransaction,
      );
      expect(enrollmentRepository.createEnrollment).toHaveBeenCalledWith(
        createdStudentIdx,
        expect.any(EnrollmentEntity),
        mockTransaction,
      );
    });

    it('학생 번호가 중복되지 않으면, 학생을 생성하고 생성된 학생 엔티티를 반환한다', async () => {
      // given
      const mockEnrollmentInfo = {
        amount: 530000,
        startedAt: dto.enrollment.startedAt,
        endedAt: new Date('2024-01-31'),
      };
      studentRepository.checkDuplicateStudentNumber.mockResolvedValue(null);
      transactionManager.runTransaction.mockImplementation(async (cb) =>
        cb(mockTransaction),
      );
      enrollmentService.createEnrollmentInfo.mockReturnValue(
        mockEnrollmentInfo,
      );
      studentRepository.createStudent.mockResolvedValue({} as StudentEntity);

      // when
      const act = await studentService.createStudent(dto);

      // then
      expect(act).toBeInstanceOf(CreateStudentResponseDto);
    });
  });

  describe('getStudentDetail', () => {
    it('학생의 인덱스를 받아 해당하는 학생의 정보를 가져온다', async () => {
      // given
      const studentIdx = 1;

      // when
      studentRepository.findStudentByIdx.mockResolvedValue({} as StudentEntity);
      const responseDtoSpy = jest.spyOn(StudentDetailResponseDto, 'of');
      const act = await studentService.getStudentDetail(studentIdx);

      // then
      expect(responseDtoSpy).toHaveBeenCalled();
      expect(act).toBeInstanceOf(StudentDetailResponseDto);
    });

    it('해당하는 학생이 존재하지 않을 경우 StudentNotFoundException 발생한다', async () => {
      // given
      const studentIdx = 999;

      // when
      studentRepository.findStudentByIdx.mockResolvedValue(null);
      const act = async () => await studentService.getStudentDetail(studentIdx);

      // then
      await expect(act).rejects.toThrow(StudentNotFoundException);
    });
  });

  describe('updateStudent', () => {
    const studentIdx = 1;
    const dto = new UpdateStudentRequestDto();

    it('해당하는 학생이 존재한다면, 정보를 수정한다', async () => {
      // given
      dto.name = '수정된 홍길동';
      studentRepository.findStudentByIdx.mockResolvedValue({} as StudentEntity);
      studentRepository.checkDuplicateStudentNumber.mockResolvedValue(null);
      studentRepository.updateStudent.mockResolvedValue({} as StudentEntity);

      // when
      await studentService.updateStudent(studentIdx, dto);

      // then
      expect(studentRepository.updateStudent).toHaveBeenCalledWith(
        studentIdx,
        expect.any(StudentEntity),
      );
      expect(studentRepository.findStudentByIdx).toHaveBeenCalledWith(
        studentIdx,
      );
    });

    describe('수정 정보에 studentNumber가 포함되어 있으면 중복 검사를 수행한다', () => {
      it('중복된 studentNumber가 존재한다면 StudentNumberConflictException 발생한다', async () => {
        // given
        dto.studentNumber = '1234';

        // when
        studentRepository.findStudentByIdx.mockResolvedValue(
          {} as StudentEntity,
        );
        studentRepository.checkDuplicateStudentNumber.mockResolvedValue(
          {} as StudentEntity,
        );
        const act = async () =>
          await studentService.updateStudent(studentIdx, dto);

        // then
        await expect(act).rejects.toThrow(StudentNumberConflictException);
      });

      it('중복된 studentNumber가 수정하려는 학생의 것이 아닐 경우 StudentNumberConflictException 발생한다', async () => {
        // given
        dto.studentNumber = '4321';
        studentRepository.findStudentByIdx.mockResolvedValue(
          {} as StudentEntity,
        );
        studentRepository.checkDuplicateStudentNumber.mockResolvedValue({
          idx: studentIdx + 1,
        } as StudentEntity);

        // when
        const act = async () =>
          await studentService.updateStudent(studentIdx, dto);

        // then
        await expect(act).rejects.toThrow(StudentNumberConflictException);
      });

      it('중복된 studentNumber가 수정하려는 학생의 것일 경우 정상적으로 수정한다', async () => {
        // given
        dto.studentNumber = '4321';

        studentRepository.findStudentByIdx.mockResolvedValue(
          {} as StudentEntity,
        );
        studentRepository.checkDuplicateStudentNumber.mockResolvedValue({
          idx: studentIdx,
        } as StudentEntity);

        // when
        await studentService.updateStudent(studentIdx, dto);

        // then
        expect(studentRepository.updateStudent).toHaveBeenCalledWith(
          studentIdx,
          expect.any(StudentEntity),
        );
      });
    });

    it('수정 정보에 studentNumber가 포함되어 있지 않다면 중복 검사를 수행하지 않는다', async () => {
      // given
      dto.studentNumber = undefined;

      // when
      studentRepository.findStudentByIdx.mockResolvedValue({} as StudentEntity);
      await studentService.updateStudent(studentIdx, dto);

      // then
      expect(
        studentRepository.checkDuplicateStudentNumber,
      ).not.toHaveBeenCalled();
    });
  });

  describe('deleteStudent', () => {
    const studentIdx = 1;
    it('학생을 삭제한다', async () => {
      // given
      studentRepository.findStudentByIdx.mockResolvedValue({} as StudentEntity);

      // when
      await studentService.deleteStudent(studentIdx);

      // then
      expect(studentRepository.deleteStudent).toHaveBeenCalledWith(studentIdx);
    });

    it('해당하는 학생이 존재하지 않을 경우 StudentNotFoundException 발생한다', async () => {
      // given
      studentRepository.findStudentByIdx.mockResolvedValue(null);

      // when
      const act = async () => await studentService.deleteStudent(studentIdx);

      // then
      await expect(act).rejects.toThrow(StudentNotFoundException);
    });
  });

  describe('getStudentNameByStudentNumber', () => {
    let studentNumber = '1234';
    it('studentNumber를 받아 해당하는 학생의 이름을 반환한다', async () => {
      // given
      const studentName = '길동홍';

      studentRepository.findStudentByStudentNumber.mockResolvedValue({
        name: studentName,
      } as StudentEntity);

      // when
      const act =
        await studentService.getStudentNameByStudentNumber(studentNumber);

      // then
      expect(act.name).toStrictEqual(studentName);
      expect(act).toMatchObject({ name: studentName });
    });

    it('만약 해당하는 학생이 존재하지 않는다면 StudentNotFoundException 발생한다', async () => {
      // given
      studentRepository.findStudentByStudentNumber.mockResolvedValue(null);

      // when
      const act = async () =>
        await studentService.getStudentNameByStudentNumber(studentNumber);

      // then
      await expect(act).rejects.toThrow(StudentNotFoundException);
    });
  });
});
