import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StudentRepository } from './student.repository';
import {
  CreateStudentRequestDto,
  CreateStudentResponseDto,
} from './dto/create-student.dto';
import { StudentDetailResponseDto } from './dto/student-detail.dto';
import { TransactionManager } from 'src/prisma/prisma-transaction.manager';
import { ParentRepository } from '../parent/parent.repository';

@Injectable()
export class StudentsService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly transactionManager: TransactionManager,
    private readonly parentRepository: ParentRepository,
  ) {}

  async createStudent(
    dto: CreateStudentRequestDto,
  ): Promise<CreateStudentResponseDto> {
    await Promise.all([this.checkDuplicateStudentNumber(dto.studentNumber)]);

    const { student, parent } = dto.toEntity();

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

        return createdStudent;
      },
    );

    return CreateStudentResponseDto.of(createdStudent);
  }

  async checkDuplicateStudentNumber(studentNumber: string): Promise<void> {
    const result =
      await this.studentRepository.checkDuplicateStudentNumber(studentNumber);
    if (result) {
      throw new ConflictException('이미 존재하는 학번입니다.');
    }
  }

  async getStudentDetail(
    studentIdx: number,
  ): Promise<StudentDetailResponseDto> {
    const student = await this.studentRepository.getStudentDetail(studentIdx);
    if (!student) {
      throw new NotFoundException('학생을 찾을 수 없습니다.');
    }

    return StudentDetailResponseDto.of(student);
  }
}
