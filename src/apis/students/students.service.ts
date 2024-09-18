import { Injectable } from '@nestjs/common';
import { StudentRepository } from './student.repository';
import {
  CreateStudentRequestDto,
  CreateStudentResponseDto,
} from './dto/create-student.dto';
import { StudentDetailResponseDto } from './dto/student-detail.dto';
import { TransactionManager } from 'src/prisma/prisma-transaction.manager';
import { ParentRepository } from '../parent/parent.repository';
import { UpdateStudentRequestDto } from './dto/update-student.dto';
import { StudentEntity } from './entity/students.entity';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { EnrollmentRepository } from '../enrollment/entollment.repository';
import { StudentNotFoundException } from './exception/student-not-found.exception';
import { StudentNumberConflictException } from './exception/student-number-conflict.exception';

@Injectable()
export class StudentsService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly transactionManager: TransactionManager,
    private readonly parentRepository: ParentRepository,
    private readonly enrollmentService: EnrollmentService,
    private readonly enrollmentRepository: EnrollmentRepository,
  ) {}

  async checkExistStudent(studentIdx: number): Promise<StudentEntity> {
    const findStudentResult =
      await this.studentRepository.findStudentByIdx(studentIdx);

    if (!findStudentResult) {
      throw new StudentNotFoundException();
    }

    return findStudentResult;
  }

  async createStudent(
    dto: CreateStudentRequestDto,
  ): Promise<CreateStudentResponseDto> {
    const student = dto.toEntity();
    const parent = dto.parent.toEntity();

    const checkDuplicateStudentNumberResult =
      await this.studentRepository.checkDuplicateStudentNumber(
        student.studentNumber,
      );
    if (checkDuplicateStudentNumberResult) {
      throw new StudentNumberConflictException();
    }

    // 등록 정보 생성
    const enrollmentInfo = this.enrollmentService.createEnrollmentInfo(
      student.type,
      dto.enrollment.startedAt,
      dto.enrollment.month,
    );
    const enrollment = dto.enrollment.toEntity(enrollmentInfo);

    const createdStudent = await this.transactionManager.runTransaction(
      async (tx) => {
        const createdStudent = await this.studentRepository.createStudent(
          student,
          tx,
        );

        await this.parentRepository.createParent(
          createdStudent.idx,
          parent,
          tx,
        );

        await this.enrollmentRepository.createEnrollment(
          createdStudent.idx,
          enrollment,
          tx,
        );

        return createdStudent;
      },
    );

    return CreateStudentResponseDto.of(createdStudent);
  }

  async getStudentDetail(
    studentIdx: number,
  ): Promise<StudentDetailResponseDto> {
    const student = await this.checkExistStudent(studentIdx);

    return StudentDetailResponseDto.of(student);
  }

  async updateStudent(
    studentIdx: number,
    dto: UpdateStudentRequestDto,
  ): Promise<void> {
    await this.checkExistStudent(studentIdx);

    if (dto.studentNumber) {
      const result = await this.studentRepository.checkDuplicateStudentNumber(
        dto.studentNumber,
      );
      if (result && result.idx !== studentIdx) {
        throw new StudentNumberConflictException();
      }
    }

    const updateStudentEntity = dto.toEntity();
    await this.studentRepository.updateStudent(studentIdx, updateStudentEntity);
  }

  async deleteStudent(studentIdx: number): Promise<void> {
    await this.checkExistStudent(studentIdx);

    await this.studentRepository.deleteStudent(studentIdx);

    return;
  }

  async getStudentNameByStudentNumber(
    studentNumber: string,
  ): Promise<Pick<StudentEntity, 'name'>> {
    const student =
      await this.studentRepository.findStudentByStudentNumber(studentNumber);

    if (!student) {
      throw new StudentNotFoundException('해당하는 학생이 존재하지 않습니다');
    }

    return {
      name: student.name,
    };
  }
}
