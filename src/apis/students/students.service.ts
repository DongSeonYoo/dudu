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
import { UpdateStudentRequestDto } from './dto/update-student.dto';

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
    const student = dto.toEntity();
    const parent = dto.parent.toEntity();

    const checkDuplicateStudentNumberResult =
      await this.studentRepository.checkDuplicateStudentNumber(
        student.studentNumber,
      );
    if (checkDuplicateStudentNumberResult) {
      throw new ConflictException('이미 존재하는 학번입니다.');
    }

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

  async getStudentDetail(
    studentIdx: number,
  ): Promise<StudentDetailResponseDto> {
    const student = await this.studentRepository.getStudentDetail(studentIdx);
    if (!student) {
      throw new NotFoundException('학생을 찾을 수 없습니다.');
    }

    return StudentDetailResponseDto.of(student);
  }

  async updateStudent(
    studentIdx: number,
    dto: UpdateStudentRequestDto,
  ): Promise<void> {
    const findStudentResult =
      await this.studentRepository.findStudentByIdx(studentIdx);
    if (!findStudentResult) {
      throw new NotFoundException('학생을 찾을 수 없습니다.');
    }

    const studentNumber = dto.studentNumber;
    if (studentNumber) {
      await this.studentRepository
        .checkDuplicateStudentNumber(studentNumber)
        .then((result) => {
          if (result) {
            throw new ConflictException('이미 존재하는 학번입니다.');
          }
        });
    }

    const updateStudentEntity = dto.toEntity();
    await this.studentRepository.updateStudent(studentIdx, updateStudentEntity);
  }

  async deleteStudent(studentIdx: number): Promise<void> {
    const findStudentResult =
      await this.studentRepository.findStudentByIdx(studentIdx);
    if (!findStudentResult) {
      throw new NotFoundException('학생을 찾을 수 없습니다.');
    }

    await this.studentRepository.deleteStudent(studentIdx);

    return;
  }
}
